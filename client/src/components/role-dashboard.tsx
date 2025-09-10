import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Brain, 
  MessageCircle, 
  Award,
  Calculator,
  Clock,
  Star,
  Target,
  BarChart3,
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import type { User } from "@shared/schema";

interface RoleDashboardProps {
  user: User;
}

export function RoleDashboard({ user }: RoleDashboardProps) {
  // Common queries for all roles
  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/my-enrollments"],
    enabled: user?.role === 'student',
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
    enabled: user?.role === 'educator' || user?.role === 'content_creator',
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/messages"],
  });

  if (user?.role === 'student') {
    return <StudentDashboard user={user} enrollments={enrollments} messages={messages} />;
  } else if (user?.role === 'parent') {
    return <ParentDashboard user={user} messages={messages} />;
  } else if (user?.role === 'educator' || user?.role === 'content_creator') {
    return <EducatorDashboard user={user} courses={courses} messages={messages} />;
  } else if (user?.role === 'administrator') {
    return <AdminDashboard user={user} messages={messages} />;
  }

  return <DefaultDashboard user={user} />;
}

function StudentDashboard({ user, enrollments, messages }: { user: User; enrollments: any[]; messages: any[] }) {
  const activeEnrollments = enrollments.filter(e => !e.completedAt);
  const completedCourses = enrollments.filter(e => e.completedAt);
  const unreadMessages = messages.filter(m => !m.isRead);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Brain className="h-4 w-4" />
          <span>{user.aiCredits || 0} AI Credits</span>
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="text-primary h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{activeEnrollments.length}</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="text-accent h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{completedCourses.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="text-chart-4 h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-chart-5/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="text-chart-5 h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{unreadMessages.length}</div>
            <div className="text-sm text-muted-foreground">New Messages</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active courses</h3>
                  <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                  <Link href="/marketplace">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                activeEnrollments.slice(0, 3).map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg hover-elevate">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calculator className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{enrollment.course?.title || 'Course Title'}</h4>
                      <p className="text-sm text-muted-foreground">Next: Continue from where you left off</p>
                      <Progress value={enrollment.progress || 0} className="mt-2" />
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* AI Tutor Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="text-primary h-5 w-5" />
                <span>AI-Powered Learning</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get personalized help with your studies using our AI tutor powered by Claude.
              </p>
              <div className="flex space-x-2">
                <Button className="flex-1">Ask AI Tutor</Button>
                <Button variant="outline">Get Study Tips</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Progress
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader>
              <CardTitle>Study Streak</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">7</div>
              <p className="text-sm text-muted-foreground">Days in a row</p>
              <p className="text-xs text-muted-foreground mt-2">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ParentDashboard({ user, messages }: { user: User; messages: any[] }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's learning progress</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Children</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-chart-5 mx-auto mb-2" />
            <div className="text-2xl font-bold">{messages.length}</div>
            <div className="text-sm text-muted-foreground">New Messages</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-chart-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">12h</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Children's Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Morgan</p>
                    <p className="text-sm text-muted-foreground">Grade 8</p>
                  </div>
                </div>
                <Badge variant="secondary">92% Progress</Badge>
              </div>
              <Progress value={92} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sarah Morgan</p>
                    <p className="text-sm text-muted-foreground">Grade 5</p>
                  </div>
                </div>
                <Badge variant="secondary">85% Progress</Badge>
              </div>
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Alex completed Math Assignment #5</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Sarah started Science Chapter 3</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-4 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New message from Mrs. Johnson</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EducatorDashboard({ user, courses, messages }: { user: User; courses: any[]; messages: any[] }) {
  const myCourses = courses.filter(c => c.instructorId === user.id);
  const totalStudents = myCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Educator Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and students</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </Button>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{user.aiCredits || 0} AI Credits</span>
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{myCourses.length}</div>
            <div className="text-sm text-muted-foreground">My Courses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-chart-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">$2,450</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to start teaching</p>
                <Button>Create Course</Button>
              </div>
            ) : (
              myCourses.slice(0, 3).map((course: any) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover-elevate">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.enrollmentCount || 0} students • {course.rating || 0} ⭐
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="text-primary h-5 w-5" />
              <span>AI-Powered Content Creation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Use AI to generate course content, create assessments, and grade assignments automatically.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">Generate Content</Button>
              <Button variant="outline" size="sm">Create Quiz</Button>
              <Button variant="outline" size="sm">Grade Papers</Button>
              <Button variant="outline" size="sm">Get Ideas</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard({ user, messages }: { user: User; messages: any[] }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
          <p className="text-muted-foreground">Manage your educational institution</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">250</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-chart-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-chart-5 mx-auto mb-2" />
            <div className="text-2xl font-bold">{messages.length}</div>
            <div className="text-sm text-muted-foreground">New Messages</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Students</span>
                <span className="text-sm font-medium">180 (72%)</span>
              </div>
              <Progress value={72} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Educators</span>
                <span className="text-sm font-medium">45 (18%)</span>
              </div>
              <Progress value={18} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Parents</span>
                <span className="text-sm font-medium">25 (10%)</span>
              </div>
              <Progress value={10} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Course Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              System Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Broadcast Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DefaultDashboard({ user }: { user: User }) {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to EduConnect!</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Your learning journey starts here
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/marketplace">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
    </div>
  );
}
