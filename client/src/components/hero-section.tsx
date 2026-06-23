import { ArrowRight, GraduationCap, Users, Presentation } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroSection() {
  const userRoles = [
    {
      icon: GraduationCap,
      title: "Students",
      subtitle: "Learn & Track Progress",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Parents",
      subtitle: "Monitor & Support",
      color: "text-accent"
    },
    {
      icon: Presentation,
      title: "Educators",
      subtitle: "Create & Teach",
      color: "text-chart-3"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Professional Learning Platform for
                <span className="text-primary"> Educators & Students</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect students, parents, and educators in a comprehensive learning ecosystem. 
                Create, share, and track educational content with AI-powered insights.
              </p>
            </div>
            
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {userRoles.map((role, index) => (
                <Card 
                  key={role.title}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer hover-elevate"
                  data-testid={`card-role-${role.title.toLowerCase()}`}
                >
                  <div className="text-center space-y-2">
                    <role.icon className={`${role.color} text-2xl h-8 w-8 mx-auto`} />
                    <h3 className="font-semibold text-sm">{role.title}</h3>
                    <p className="text-xs text-muted-foreground">{role.subtitle}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="flex items-center space-x-2"
                data-testid="button-start-learning"
              >
                <Link href="/dashboard">
                  <span>Start Learning</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-explore-courses"
              >
                Explore Courses
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Students collaborating on educational projects" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="img-hero"
            />
            <Card className="absolute -bottom-6 -left-6 p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Learning Session</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
