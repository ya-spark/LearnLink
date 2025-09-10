import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Note: Firebase handles authentication, no sessions table needed

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'parent', 'educator', 'content_creator', 'administrator']);
export const gradeEnum = pgEnum('grade', ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'college']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['free', 'premium', 'institution']);
export const contentTypeEnum = pgEnum('content_type', ['lesson', 'assignment', 'assessment', 'resource']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'file', 'ai_response']);

// User storage table (Firebase Auth compatible)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Firebase UID, no default needed
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('student'),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('free'),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  aiCredits: integer("ai_credits").default(5),
  instituteId: varchar("institute_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Institutes
export const institutes = pgTable("institutes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('free'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parent-Student relationships
export const parentStudentRelations = pgTable("parent_student_relations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  relationship: varchar("relationship").default('parent'), // parent, guardian, etc.
  canViewProgress: boolean("can_view_progress").default(true),
  canViewMessages: boolean("can_view_messages").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  gradeLevel: gradeEnum("grade_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Topics
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).default('0.00'),
  thumbnailUrl: varchar("thumbnail_url"),
  instructorId: varchar("instructor_id").notNull().references(() => users.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  gradeLevel: gradeEnum("grade_level").notNull(),
  isPublished: boolean("is_published").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0.00'),
  enrollmentCount: integer("enrollment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Content
export const courseContent = pgTable("course_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  topicId: varchar("topic_id").references(() => topics.id),
  title: varchar("title").notNull(),
  type: contentTypeEnum("type").notNull(),
  content: text("content"), // Rich text content
  fileUrl: varchar("file_url"), // For file attachments
  order: integer("order").default(0),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0.00'), // percentage
  completedAt: timestamp("completed_at"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Progress Tracking
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull().references(() => courseContent.id),
  isCompleted: boolean("is_completed").default(false),
  timeSpent: integer("time_spent").default(0), // in minutes
  score: decimal("score", { precision: 5, scale: 2 }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assessments
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  contentId: varchar("content_id").references(() => courseContent.id),
  maxScore: decimal("max_score", { precision: 10, scale: 2 }).default('100.00'),
  timeLimit: integer("time_limit"), // in minutes
  instructions: text("instructions"),
  questions: jsonb("questions"), // Array of question objects
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment Submissions
export const assessmentSubmissions = pgTable("assessment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull().references(() => assessments.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  answers: jsonb("answers"), // Array of answer objects
  score: decimal("score", { precision: 10, scale: 2 }),
  isGraded: boolean("is_graded").default(false),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
});

// Messages/Communication
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").references(() => users.id), // null for group messages
  courseId: varchar("course_id").references(() => courses.id), // for course-specific discussions
  parentMessageId: varchar("parent_message_id").references(() => messages.id), // for replies
  type: messageTypeEnum("type").default('text'),
  content: text("content").notNull(),
  fileUrl: varchar("file_url"),
  isRead: boolean("is_read").default(false),
  aiGenerated: boolean("ai_generated").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
});

// AI Credit Transactions
export const aiCreditTransactions = pgTable("ai_credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // positive for purchase, negative for usage
  type: varchar("type").notNull(), // purchase, usage, bonus, refund
  description: text("description"),
  relatedMessageId: varchar("related_message_id").references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course Reviews
export const courseReviews = pgTable("course_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  institute: one(institutes, {
    fields: [users.instituteId],
    references: [institutes.id],
  }),
  coursesAsInstructor: many(courses),
  enrollments: many(enrollments),
  progress: many(studentProgress),
  assessmentSubmissions: many(assessmentSubmissions),
  sentMessages: many(messages, { relationName: 'sentMessages' }),
  receivedMessages: many(messages, { relationName: 'receivedMessages' }),
  aiTransactions: many(aiCreditTransactions),
  reviews: many(courseReviews),
  parentRelations: many(parentStudentRelations, { relationName: 'parentRelations' }),
  studentRelations: many(parentStudentRelations, { relationName: 'studentRelations' }),
}));

export const institutesRelations = relations(institutes, ({ one, many }) => ({
  admin: one(users, {
    fields: [institutes.adminId],
    references: [users.id],
  }),
  members: many(users),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  topics: many(topics),
  courses: many(courses),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
  content: many(courseContent),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [courses.subjectId],
    references: [subjects.id],
  }),
  content: many(courseContent),
  enrollments: many(enrollments),
  assessments: many(assessments),
  messages: many(messages),
  reviews: many(courseReviews),
}));

export const courseContentRelations = relations(courseContent, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseContent.courseId],
    references: [courses.id],
  }),
  topic: one(topics, {
    fields: [courseContent.topicId],
    references: [topics.id],
  }),
  progress: many(studentProgress),
  assessments: many(assessments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const studentProgressRelations = relations(studentProgress, ({ one }) => ({
  student: one(users, {
    fields: [studentProgress.studentId],
    references: [users.id],
  }),
  content: one(courseContent, {
    fields: [studentProgress.contentId],
    references: [courseContent.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
  content: one(courseContent, {
    fields: [assessments.contentId],
    references: [courseContent.id],
  }),
  submissions: many(assessmentSubmissions),
}));

export const assessmentSubmissionsRelations = relations(assessmentSubmissions, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentSubmissions.assessmentId],
    references: [assessments.id],
  }),
  student: one(users, {
    fields: [assessmentSubmissions.studentId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sentMessages',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receivedMessages',
  }),
  course: one(courses, {
    fields: [messages.courseId],
    references: [courses.id],
  }),
  parentMessage: one(messages, {
    fields: [messages.parentMessageId],
    references: [messages.id],
    relationName: 'messageReplies',
  }),
  replies: many(messages, { relationName: 'messageReplies' }),
  aiTransactions: many(aiCreditTransactions),
}));

export const aiCreditTransactionsRelations = relations(aiCreditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [aiCreditTransactions.userId],
    references: [users.id],
  }),
  relatedMessage: one(messages, {
    fields: [aiCreditTransactions.relatedMessageId],
    references: [messages.id],
  }),
}));

export const courseReviewsRelations = relations(courseReviews, ({ one }) => ({
  course: one(courses, {
    fields: [courseReviews.courseId],
    references: [courses.id],
  }),
  student: one(users, {
    fields: [courseReviews.studentId],
    references: [users.id],
  }),
}));

export const parentStudentRelationsRelations = relations(parentStudentRelations, ({ one }) => ({
  parent: one(users, {
    fields: [parentStudentRelations.parentId],
    references: [users.id],
    relationName: 'parentRelations',
  }),
  student: one(users, {
    fields: [parentStudentRelations.studentId],
    references: [users.id],
    relationName: 'studentRelations',
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInstituteSchema = createInsertSchema(institutes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseContentSchema = createInsertSchema(courseContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSubmissionSchema = createInsertSchema(assessmentSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export const insertAiCreditTransactionSchema = createInsertSchema(aiCreditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertCourseReviewSchema = createInsertSchema(courseReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertParentStudentRelationSchema = createInsertSchema(parentStudentRelations).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Institute = typeof institutes.$inferSelect;
export type InsertInstitute = z.infer<typeof insertInstituteSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type CourseContent = typeof courseContent.$inferSelect;
export type InsertCourseContent = z.infer<typeof insertCourseContentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type AssessmentSubmission = typeof assessmentSubmissions.$inferSelect;
export type InsertAssessmentSubmission = z.infer<typeof insertAssessmentSubmissionSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type AiCreditTransaction = typeof aiCreditTransactions.$inferSelect;
export type InsertAiCreditTransaction = z.infer<typeof insertAiCreditTransactionSchema>;
export type CourseReview = typeof courseReviews.$inferSelect;
export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export type ParentStudentRelation = typeof parentStudentRelations.$inferSelect;
export type InsertParentStudentRelation = z.infer<typeof insertParentStudentRelationSchema>;
