import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Users, Clock, BookOpen, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["/api/courses", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: courseContent = [] } = useQuery({
    queryKey: ["/api/courses", id, "content"],
    enabled: isAuthenticated && !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/courses", id, "reviews"],
    enabled: isAuthenticated && !!id,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/my-enrollments"],
    enabled: isAuthenticated,
  });

  const enrollmentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/enrollments", { courseId: id });
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in this course!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || courseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !course) {
    return null;
  }

  const isEnrolled = enrollments.some((enrollment: any) => enrollment.courseId === id);
  const enrollment = enrollments.find((enrollment: any) => enrollment.courseId === id);

  const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
    { value: "11", label: "Grade 11" },
    { value: "12", label: "Grade 12" },
    { value: "college", label: "College+" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Course Header */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {gradeOptions.find(g => g.value === course.gradeLevel)?.label || course.gradeLevel}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-400 h-4 w-4 fill-current" />
                <span className="text-sm text-muted-foreground">{course.rating || "0.0"}</span>
                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold" data-testid="text-course-title">
              {course.title}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {course.description}
            </p>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={course.instructor?.profileImageUrl} />
                  <AvatarFallback>
                    {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.enrollmentCount || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Self-paced</span>
              </div>
            </div>

            {isEnrolled && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {enrollment?.progress || 0}% Complete
                    </span>
                  </div>
                  <Progress value={enrollment?.progress || 0} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Course Content Tabs */}
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Course Materials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseContent.length === 0 ? (
                    <p className="text-muted-foreground">No content available yet.</p>
                  ) : (
                    courseContent.map((content: any, index: number) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                        data-testid={`content-item-${index}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{content.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {content.type} • {content.duration ? `${content.duration} min` : 'Self-paced'}
                            </p>
                          </div>
                        </div>
                        {isEnrolled && (
                          <Badge variant="outline">
                            <Award className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground">No reviews yet.</p>
                  ) : (
                    reviews.map((review: any) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {review.student?.firstName?.[0]}{review.student?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {review.student?.firstName} {review.student?.lastName}
                              </span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.review}</p>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Course Discussions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join course discussions to connect with other students and ask questions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  ${course.price || "0.00"}
                </div>
                <p className="text-sm text-muted-foreground">One-time purchase</p>
              </div>

              {isEnrolled ? (
                <Button className="w-full" disabled>
                  Already Enrolled
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => enrollmentMutation.mutate()}
                  disabled={enrollmentMutation.isPending}
                  data-testid="button-enroll"
                >
                  {enrollmentMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{courseContent.length} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Instructor support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor?.profileImageUrl} />
                  <AvatarFallback>
                    {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {course.instructor?.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Expert educator with years of experience in {course.subject?.name || 'education'}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
