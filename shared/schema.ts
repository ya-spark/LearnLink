import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoles = [
  "student",
  "parent",
  "educator",
  "content_creator",
  "administrator",
] as const;

export const grades = [
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "college",
] as const;

export const subscriptionStatuses = ["free", "premium", "institution"] as const;
export const contentTypes = ["lesson", "assignment", "assessment", "resource"] as const;
export const messageTypes = ["text", "file", "ai_response"] as const;

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role", { enum: userRoles }).default("student"),
  subscriptionStatus: text("subscription_status", { enum: subscriptionStatuses }).default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  aiCredits: integer("ai_credits").default(5),
  instituteId: text("institute_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const institutes = sqliteTable("institutes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  adminId: text("admin_id").notNull().references(() => users.id),
  subscriptionStatus: text("subscription_status", { enum: subscriptionStatuses }).default("free"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const parentStudentRelations = sqliteTable("parent_student_relations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  parentId: text("parent_id").notNull().references(() => users.id),
  studentId: text("student_id").notNull().references(() => users.id),
  relationship: text("relationship").default("parent"),
  canViewProgress: integer("can_view_progress", { mode: "boolean" }).default(true),
  canViewMessages: integer("can_view_messages", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const subjects = sqliteTable("subjects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  gradeLevel: text("grade_level", { enum: grades }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const topics = sqliteTable("topics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  subjectId: text("subject_id").notNull().references(() => subjects.id),
  order: integer("order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").default("0.00"),
  thumbnailUrl: text("thumbnail_url"),
  instructorId: text("instructor_id").notNull().references(() => users.id),
  subjectId: text("subject_id").notNull().references(() => subjects.id),
  gradeLevel: text("grade_level", { enum: grades }).notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  rating: text("rating").default("0.00"),
  enrollmentCount: integer("enrollment_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const courseContent = sqliteTable("course_content", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  topicId: text("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  type: text("type", { enum: contentTypes }).notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  order: integer("order").default(0),
  duration: integer("duration"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id").notNull().references(() => users.id),
  courseId: text("course_id").notNull().references(() => courses.id),
  progress: text("progress").default("0.00"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const studentProgress = sqliteTable("student_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id").notNull().references(() => users.id),
  contentId: text("content_id").notNull().references(() => courseContent.id),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  timeSpent: integer("time_spent").default(0),
  score: text("score"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const assessments = sqliteTable("assessments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  courseId: text("course_id").notNull().references(() => courses.id),
  contentId: text("content_id").references(() => courseContent.id),
  maxScore: text("max_score").default("100.00"),
  timeLimit: integer("time_limit"),
  instructions: text("instructions"),
  questions: text("questions", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const assessmentSubmissions = sqliteTable("assessment_submissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  assessmentId: text("assessment_id").notNull().references(() => assessments.id),
  studentId: text("student_id").notNull().references(() => users.id),
  answers: text("answers", { mode: "json" }),
  score: text("score"),
  isGraded: integer("is_graded", { mode: "boolean" }).default(false),
  feedback: text("feedback"),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  gradedAt: integer("graded_at", { mode: "timestamp" }),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  senderId: text("sender_id").notNull().references(() => users.id),
  receiverId: text("receiver_id").references(() => users.id),
  courseId: text("course_id").references(() => courses.id),
  parentMessageId: text("parent_message_id"),
  type: text("type", { enum: messageTypes }).default("text"),
  content: text("content").notNull(),
  fileUrl: text("file_url"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(false),
  sentAt: integer("sent_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const aiCreditTransactions = sqliteTable("ai_credit_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  relatedMessageId: text("related_message_id").references(() => messages.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const courseReviews = sqliteTable("course_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id),
  studentId: text("student_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  institute: one(institutes, {
    fields: [users.instituteId],
    references: [institutes.id],
  }),
  coursesAsInstructor: many(courses),
  enrollments: many(enrollments),
  progress: many(studentProgress),
  assessmentSubmissions: many(assessmentSubmissions),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  aiTransactions: many(aiCreditTransactions),
  reviews: many(courseReviews),
  parentRelations: many(parentStudentRelations, { relationName: "parentRelations" }),
  studentRelations: many(parentStudentRelations, { relationName: "studentRelations" }),
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
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  course: one(courses, {
    fields: [messages.courseId],
    references: [courses.id],
  }),
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
    relationName: "parentRelations",
  }),
  student: one(users, {
    fields: [parentStudentRelations.studentId],
    references: [users.id],
    relationName: "studentRelations",
  }),
}));

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
