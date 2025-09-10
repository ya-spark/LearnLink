import {
  users,
  institutes,
  subjects,
  topics,
  courses,
  courseContent,
  enrollments,
  studentProgress,
  assessments,
  assessmentSubmissions,
  messages,
  aiCreditTransactions,
  courseReviews,
  parentStudentRelations,
  type User,
  type UpsertUser,
  type Institute,
  type InsertInstitute,
  type Subject,
  type InsertSubject,
  type Topic,
  type InsertTopic,
  type Course,
  type InsertCourse,
  type CourseContent,
  type InsertCourseContent,
  type Enrollment,
  type InsertEnrollment,
  type StudentProgress,
  type InsertStudentProgress,
  type Assessment,
  type InsertAssessment,
  type AssessmentSubmission,
  type InsertAssessmentSubmission,
  type Message,
  type InsertMessage,
  type AiCreditTransaction,
  type InsertAiCreditTransaction,
  type CourseReview,
  type InsertCourseReview,
  type ParentStudentRelation,
  type InsertParentStudentRelation,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like, ilike, or, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User>;
  updateUserAiCredits(userId: string, credits: number): Promise<User>;
  
  // Institute operations
  createInstitute(institute: InsertInstitute): Promise<Institute>;
  getInstitute(id: string): Promise<Institute | undefined>;
  getInstitutesByAdmin(adminId: string): Promise<Institute[]>;
  
  // Subject and Topic operations
  getSubjects(): Promise<Subject[]>;
  getSubjectsByGrade(grade: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getTopicsBySubject(subjectId: string): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Course operations
  getCourses(filters?: { gradeLevel?: string; subjectId?: string; search?: string }): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<Course>): Promise<Course>;
  
  // Course content operations
  getCourseContent(courseId: string): Promise<CourseContent[]>;
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;
  updateCourseContent(id: string, updates: Partial<CourseContent>): Promise<CourseContent>;
  
  // Enrollment operations
  enrollStudent(enrollment: InsertEnrollment): Promise<Enrollment>;
  getStudentEnrollments(studentId: string): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: string): Promise<Enrollment[]>;
  
  // Progress tracking
  updateStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  getStudentProgress(studentId: string, courseId?: string): Promise<StudentProgress[]>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsByCourse(courseId: string): Promise<Assessment[]>;
  submitAssessment(submission: InsertAssessmentSubmission): Promise<AssessmentSubmission>;
  getStudentSubmissions(studentId: string, assessmentId?: string): Promise<AssessmentSubmission[]>;
  
  // Message operations
  sendMessage(message: InsertMessage): Promise<Message>;
  getMessages(userId: string, filters?: { courseId?: string; conversationWith?: string }): Promise<Message[]>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // AI credit operations
  addAiCreditTransaction(transaction: InsertAiCreditTransaction): Promise<AiCreditTransaction>;
  getUserAiCredits(userId: string): Promise<number>;
  
  // Review operations
  addCourseReview(review: InsertCourseReview): Promise<CourseReview>;
  getCourseReviews(courseId: string): Promise<CourseReview[]>;
  
  // Parent-Student relationships
  addParentStudentRelation(relation: InsertParentStudentRelation): Promise<ParentStudentRelation>;
  getParentStudents(parentId: string): Promise<User[]>;
  getStudentParents(studentId: string): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserAiCredits(userId: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        aiCredits: credits,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Institute operations
  async createInstitute(institute: InsertInstitute): Promise<Institute> {
    const [newInstitute] = await db.insert(institutes).values(institute).returning();
    return newInstitute;
  }

  async getInstitute(id: string): Promise<Institute | undefined> {
    const [institute] = await db.select().from(institutes).where(eq(institutes.id, id));
    return institute;
  }

  async getInstitutesByAdmin(adminId: string): Promise<Institute[]> {
    return await db.select().from(institutes).where(eq(institutes.adminId, adminId));
  }

  // Subject and Topic operations
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).orderBy(subjects.name);
  }

  async getSubjectsByGrade(grade: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.gradeLevel, grade)).orderBy(subjects.name);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    return await db.select().from(topics).where(eq(topics.subjectId, subjectId)).orderBy(topics.order, topics.name);
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [newTopic] = await db.insert(topics).values(topic).returning();
    return newTopic;
  }

  // Course operations
  async getCourses(filters?: { gradeLevel?: string; subjectId?: string; search?: string }): Promise<Course[]> {
    let query = db.select().from(courses).where(eq(courses.isPublished, true));
    
    if (filters?.gradeLevel) {
      query = query.where(eq(courses.gradeLevel, filters.gradeLevel));
    }
    
    if (filters?.subjectId) {
      query = query.where(eq(courses.subjectId, filters.subjectId));
    }
    
    if (filters?.search) {
      query = query.where(
        or(
          ilike(courses.title, `%${filters.search}%`),
          ilike(courses.description, `%${filters.search}%`)
        )
      );
    }
    
    return await query.orderBy(desc(courses.rating), desc(courses.enrollmentCount));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.instructorId, instructorId)).orderBy(desc(courses.createdAt));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Course content operations
  async getCourseContent(courseId: string): Promise<CourseContent[]> {
    return await db.select().from(courseContent).where(eq(courseContent.courseId, courseId)).orderBy(courseContent.order);
  }

  async createCourseContent(content: InsertCourseContent): Promise<CourseContent> {
    const [newContent] = await db.insert(courseContent).values(content).returning();
    return newContent;
  }

  async updateCourseContent(id: string, updates: Partial<CourseContent>): Promise<CourseContent> {
    const [updatedContent] = await db
      .update(courseContent)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courseContent.id, id))
      .returning();
    return updatedContent;
  }

  // Enrollment operations
  async enrollStudent(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    
    // Update course enrollment count
    await db
      .update(courses)
      .set({
        enrollmentCount: sql`${courses.enrollmentCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, enrollment.courseId));
    
    return newEnrollment;
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId)).orderBy(desc(enrollments.enrolledAt));
  }

  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId)).orderBy(desc(enrollments.enrolledAt));
  }

  // Progress tracking
  async updateStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress> {
    const [existingProgress] = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.studentId, progress.studentId),
          eq(studentProgress.contentId, progress.contentId)
        )
      );

    if (existingProgress) {
      const [updatedProgress] = await db
        .update(studentProgress)
        .set(progress)
        .where(eq(studentProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      const [newProgress] = await db.insert(studentProgress).values(progress).returning();
      return newProgress;
    }
  }

  async getStudentProgress(studentId: string, courseId?: string): Promise<StudentProgress[]> {
    let query = db.select().from(studentProgress).where(eq(studentProgress.studentId, studentId));
    
    if (courseId) {
      query = query.innerJoin(courseContent, eq(studentProgress.contentId, courseContent.id))
                   .where(and(
                     eq(studentProgress.studentId, studentId),
                     eq(courseContent.courseId, courseId)
                   ));
    }
    
    return await query.orderBy(desc(studentProgress.createdAt));
  }

  // Assessment operations
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessmentsByCourse(courseId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.courseId, courseId)).orderBy(desc(assessments.createdAt));
  }

  async submitAssessment(submission: InsertAssessmentSubmission): Promise<AssessmentSubmission> {
    const [newSubmission] = await db.insert(assessmentSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getStudentSubmissions(studentId: string, assessmentId?: string): Promise<AssessmentSubmission[]> {
    let query = db.select().from(assessmentSubmissions).where(eq(assessmentSubmissions.studentId, studentId));
    
    if (assessmentId) {
      query = query.where(
        and(
          eq(assessmentSubmissions.studentId, studentId),
          eq(assessmentSubmissions.assessmentId, assessmentId)
        )
      );
    }
    
    return await query.orderBy(desc(assessmentSubmissions.submittedAt));
  }

  // Message operations
  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(userId: string, filters?: { courseId?: string; conversationWith?: string }): Promise<Message[]> {
    let query = db.select().from(messages);
    
    if (filters?.courseId) {
      query = query.where(eq(messages.courseId, filters.courseId));
    } else if (filters?.conversationWith) {
      query = query.where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, filters.conversationWith)),
          and(eq(messages.senderId, filters.conversationWith), eq(messages.receiverId, userId))
        )
      );
    } else {
      query = query.where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      );
    }
    
    return await query.orderBy(desc(messages.sentAt));
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
  }

  // AI credit operations
  async addAiCreditTransaction(transaction: InsertAiCreditTransaction): Promise<AiCreditTransaction> {
    const [newTransaction] = await db.insert(aiCreditTransactions).values(transaction).returning();
    
    // Update user's AI credits
    const user = await this.getUser(transaction.userId);
    if (user) {
      const newCredits = Math.max(0, (user.aiCredits || 0) + transaction.amount);
      await this.updateUserAiCredits(transaction.userId, newCredits);
    }
    
    return newTransaction;
  }

  async getUserAiCredits(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user?.aiCredits || 0;
  }

  // Review operations
  async addCourseReview(review: InsertCourseReview): Promise<CourseReview> {
    const [newReview] = await db.insert(courseReviews).values(review).returning();
    
    // Update course average rating
    const reviews = await this.getCourseReviews(review.courseId);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await db
      .update(courses)
      .set({
        rating: avgRating.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(courses.id, review.courseId));
    
    return newReview;
  }

  async getCourseReviews(courseId: string): Promise<CourseReview[]> {
    return await db.select().from(courseReviews).where(eq(courseReviews.courseId, courseId)).orderBy(desc(courseReviews.createdAt));
  }

  // Parent-Student relationships
  async addParentStudentRelation(relation: InsertParentStudentRelation): Promise<ParentStudentRelation> {
    const [newRelation] = await db.insert(parentStudentRelations).values(relation).returning();
    return newRelation;
  }

  async getParentStudents(parentId: string): Promise<User[]> {
    const relations = await db
      .select({ student: users })
      .from(parentStudentRelations)
      .innerJoin(users, eq(parentStudentRelations.studentId, users.id))
      .where(eq(parentStudentRelations.parentId, parentId));
    
    return relations.map(r => r.student);
  }

  async getStudentParents(studentId: string): Promise<User[]> {
    const relations = await db
      .select({ parent: users })
      .from(parentStudentRelations)
      .innerJoin(users, eq(parentStudentRelations.parentId, users.id))
      .where(eq(parentStudentRelations.studentId, studentId));
    
    return relations.map(r => r.parent);
  }
}

export const storage = new DatabaseStorage();
