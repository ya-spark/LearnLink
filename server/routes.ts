import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  provideTutoring, 
  gradeAssignment, 
  generateContent, 
  generateRecommendations,
  calculateAiCreditCost,
  type TutoringSession,
  type GradingRequest,
  type ContentGenerationRequest
} from "./anthropic";
import { 
  insertCourseSchema, 
  insertCourseContentSchema,
  insertEnrollmentSchema,
  insertAssessmentSchema,
  insertAssessmentSubmissionSchema,
  insertMessageSchema,
  insertCourseReviewSchema,
  insertParentStudentRelationSchema
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const { gradeLevel, subjectId, search } = req.query;
      const courses = await storage.getCourses({
        gradeLevel: gradeLevel as string,
        subjectId: subjectId as string,
        search: search as string,
      });
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseData = insertCourseSchema.parse({
        ...req.body,
        instructorId: userId,
      });
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Course content routes
  app.get('/api/courses/:id/content', async (req, res) => {
    try {
      const content = await storage.getCourseContent(req.params.id);
      res.json(content);
    } catch (error) {
      console.error("Error fetching course content:", error);
      res.status(500).json({ message: "Failed to fetch course content" });
    }
  });

  app.post('/api/courses/:id/content', isAuthenticated, async (req, res) => {
    try {
      const contentData = insertCourseContentSchema.parse({
        ...req.body,
        courseId: req.params.id,
      });
      
      const content = await storage.createCourseContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating course content:", error);
      res.status(500).json({ message: "Failed to create course content" });
    }
  });

  // Enrollment routes
  app.post('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        studentId: userId,
      });
      
      const enrollment = await storage.enrollStudent(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to enroll student" });
    }
  });

  app.get('/api/my-enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getStudentEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Subjects and topics routes
  app.get('/api/subjects', async (req, res) => {
    try {
      const { grade } = req.query;
      const subjects = grade 
        ? await storage.getSubjectsByGrade(grade as string)
        : await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.get('/api/subjects/:id/topics', async (req, res) => {
    try {
      const topics = await storage.getTopicsBySubject(req.params.id);
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // AI features routes
  app.post('/api/ai/tutoring', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.aiCredits || 0) < 1) {
        return res.status(402).json({ message: "Insufficient AI credits" });
      }

      const session: TutoringSession = req.body;
      const response = await provideTutoring(session);
      
      // Deduct AI credits
      await storage.addAiCreditTransaction({
        userId,
        amount: -calculateAiCreditCost('tutoring'),
        type: 'usage',
        description: 'AI tutoring session',
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in AI tutoring:", error);
      res.status(500).json({ message: "Failed to provide tutoring" });
    }
  });

  app.post('/api/ai/grade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.aiCredits || 0) < 2) {
        return res.status(402).json({ message: "Insufficient AI credits" });
      }

      const gradingRequest: GradingRequest = req.body;
      const result = await gradeAssignment(gradingRequest);
      
      // Deduct AI credits
      await storage.addAiCreditTransaction({
        userId,
        amount: -calculateAiCreditCost('grading'),
        type: 'usage',
        description: 'AI assignment grading',
      });

      res.json(result);
    } catch (error) {
      console.error("Error in AI grading:", error);
      res.status(500).json({ message: "Failed to grade assignment" });
    }
  });

  app.post('/api/ai/generate-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.aiCredits || 0) < 3) {
        return res.status(402).json({ message: "Insufficient AI credits" });
      }

      const contentRequest: ContentGenerationRequest = req.body;
      const content = await generateContent(contentRequest);
      
      // Deduct AI credits
      await storage.addAiCreditTransaction({
        userId,
        amount: -calculateAiCreditCost('content_generation'),
        type: 'usage',
        description: 'AI content generation',
      });

      res.json({ content });
    } catch (error) {
      console.error("Error in AI content generation:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Messages routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId, conversationWith } = req.query;
      
      const messages = await storage.getMessages(userId, {
        courseId: courseId as string,
        conversationWith: conversationWith as string,
      });
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      
      const message = await storage.sendMessage(messageData);
      
      // Broadcast message via WebSocket if receiver is online
      // This will be implemented in the WebSocket section below
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Progress tracking routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { courseId } = req.query;
      
      const progress = await storage.getStudentProgress(userId, courseId as string);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Assessment routes
  app.get('/api/courses/:id/assessments', async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByCourse(req.params.id);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post('/api/assessments', isAuthenticated, async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.post('/api/assessments/:id/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const submissionData = insertAssessmentSubmissionSchema.parse({
        ...req.body,
        assessmentId: req.params.id,
        studentId: userId,
      });
      
      const submission = await storage.submitAssessment(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      res.status(500).json({ message: "Failed to submit assessment" });
    }
  });

  // Course reviews routes
  app.get('/api/courses/:id/reviews', async (req, res) => {
    try {
      const reviews = await storage.getCourseReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/courses/:id/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertCourseReviewSchema.parse({
        ...req.body,
        courseId: req.params.id,
        studentId: userId,
      });
      
      const review = await storage.addCourseReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Failed to add review" });
    }
  });

  // Payment routes (Stripe)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        res.send({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });

        return;
      }
      
      if (!user.email) {
        throw new Error('No user email on file');
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      });

      user = await storage.updateUserStripeInfo(user.id, { customerId: customer.id, subscriptionId: '' });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          // STRIPE_PRICE_ID will need to be set by the user
          price: process.env.STRIPE_PRICE_ID || 'price_default',
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, {
        customerId: customer.id, 
        subscriptionId: subscription.id
      });
  
      res.send({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  // AI Credits purchase
  app.post('/api/purchase-credits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { credits, amount } = req.body;
      
      // Create payment intent for credit purchase
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: {
          userId,
          credits: credits.toString(),
          type: 'ai_credits'
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error purchasing credits: " + error.message });
    }
  });

  // WebSocket setup for real-time messaging
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active connections
  const activeConnections = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    let userId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth' && message.userId) {
          userId = message.userId;
          activeConnections.set(userId, ws);
          ws.send(JSON.stringify({ type: 'auth_success' }));
        } else if (message.type === 'send_message' && userId) {
          // Handle real-time message sending
          const newMessage = await storage.sendMessage({
            senderId: userId,
            receiverId: message.receiverId,
            courseId: message.courseId,
            content: message.content,
            type: message.messageType || 'text',
          });

          // Send to receiver if online
          if (message.receiverId && activeConnections.has(message.receiverId)) {
            const receiverWs = activeConnections.get(message.receiverId);
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(JSON.stringify({
                type: 'new_message',
                message: newMessage
              }));
            }
          }

          // Confirm to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: newMessage
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      if (userId) {
        activeConnections.delete(userId);
      }
    });
  });

  return httpServer;
}
