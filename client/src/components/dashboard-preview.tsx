import { useState } from "react";
import { TrendingUp, Calculator, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("student");

  const tabs = [
    { id: "student", label: "Student Dashboard" },
    { id: "parent", label: "Parent Dashboard" },
    { id: "educator", label: "Educator Dashboard" }
  ];

  const activeCourses = [
    {
      id: 1,
      title: "Advanced Calculus",
      nextLesson: "Integration Techniques",
      progress: 85,
      dueIn: "3 days",
      icon: Calculator
    }
  ];

  const assignments = [
    {
      id: 1,
      title: "Chemistry Lab Report",
      dueDate: "Due tomorrow"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Role-Based Dashboards</h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for every type of user in the learning ecosystem.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-lg p-1 flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="rounded-md"
                data-testid={`button-tab-${tab.id}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Student Dashboard Preview */}
        {activeTab === "student" && (
          <Card className="bg-background border border-border rounded-2xl p-8" data-testid="dashboard-student">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="text-primary h-5 w-5" />
                      <span>Learning Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-primary font-bold text-lg" data-testid="stat-completion">78%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Courses Complete</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-accent font-bold text-lg" data-testid="stat-streak">12</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Day Streak</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-chart-4 font-bold text-lg" data-testid="stat-grade">A-</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Average Grade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <course.icon className="text-primary h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium" data-testid={`course-title-${course.id}`}>
                              {course.title}
                            </p>
                            <p className="text-sm text-muted-foreground">Next: {course.nextLesson}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{course.progress}% Complete</p>
                          <p className="text-xs text-muted-foreground">Due: {course.dueIn}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Assignments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm" data-testid={`assignment-title-${assignment.id}`}>
                            {assignment.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{assignment.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Tutor */}
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                      <Brain className="text-primary h-5 w-5" />
                      <span>AI Tutor</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Get instant help with your studies</p>
                    <Button 
                      className="w-full" 
                      size="sm"
                      data-testid="button-ai-tutor"
                    >
                      Ask a Question
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* Parent Dashboard Preview */}
        {activeTab === "parent" && (
          <Card className="bg-background border border-border rounded-2xl p-8" data-testid="dashboard-parent">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Parent Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Monitor your children's progress, view assignments, and communicate with teachers
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium mb-2">Child Progress</h4>
                    <Progress value={85} className="mb-2" />
                    <p className="text-sm text-muted-foreground">85% weekly goals met</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium mb-2">Communication</h4>
                    <p className="text-sm text-muted-foreground">3 new messages from teachers</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* Educator Dashboard Preview */}
        {activeTab === "educator" && (
          <Card className="bg-background border border-border rounded-2xl p-8" data-testid="dashboard-educator">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Educator Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Create content, manage students, track performance, and utilize AI tools
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium mb-2">My Courses</h4>
                    <p className="text-sm text-muted-foreground">5 active courses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium mb-2">Students</h4>
                    <p className="text-sm text-muted-foreground">124 enrolled students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium mb-2">AI Content</h4>
                    <p className="text-sm text-muted-foreground">50 AI credits remaining</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
