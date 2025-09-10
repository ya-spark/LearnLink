import { Brain, Store, School, TrendingUp, MessageCircle, ClipboardCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Leverage Claude AI for personalized tutoring, automated grading, and intelligent content recommendations.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      action: "Learn more"
    },
    {
      icon: Store,
      title: "Content Marketplace",
      description: "Discover and purchase educational content across K-12+ grade levels with organized subject structure.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      action: "Browse catalog"
    },
    {
      icon: School,
      title: "Institute Management",
      description: "Comprehensive tools for educational institutions with role-based access and administrative controls.",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      action: "Explore features"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time analytics and reporting for students, parents, and educators with detailed insights.",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      action: "View analytics"
    },
    {
      icon: MessageCircle,
      title: "Communication Hub",
      description: "Secure messaging, discussion forums, and real-time communication between all user types.",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      action: "Join discussions"
    },
    {
      icon: ClipboardCheck,
      title: "Assessment Tools",
      description: "Create and grade assessments automatically with comprehensive gradebook and attendance tracking.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      action: "Create assessments"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Learning Ecosystem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, deliver, and track educational content across all learning levels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="bg-background border border-border hover:shadow-lg transition-shadow hover-elevate"
              data-testid={`card-feature-${index}`}
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`${feature.color} text-xl h-6 w-6`} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm text-primary cursor-pointer hover:text-primary/80 transition-colors">
                  <span>{feature.action}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
