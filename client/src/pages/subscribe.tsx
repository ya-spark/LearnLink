import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Users, Zap } from "lucide-react";

export default function Subscribe() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "institution" | null>(null);

  const pricingPlans = [
    {
      id: "free",
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic course access",
        "Progress tracking",
        "Community forums",
        "5 AI credits/month",
      ],
      icon: Users,
      current: user?.subscriptionStatus === "free",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19/month",
      description: "Everything you need to excel",
      features: [
        "Unlimited course access",
        "Advanced analytics",
        "Priority support",
        "100 AI credits/month",
        "Content creation tools",
      ],
      icon: Crown,
      popular: true,
      current: user?.subscriptionStatus === "premium",
    },
    {
      id: "institution",
      name: "Institution",
      price: "Custom",
      description: "For schools and organizations",
      features: [
        "Everything in Premium",
        "Multi-user management",
        "Custom branding",
        "Unlimited AI credits",
        "Dedicated support",
      ],
      icon: Zap,
      current: user?.subscriptionStatus === "institution",
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === "premium") {
      setSelectedPlan("premium");
      toast({
        title: "Premium plan selected",
        description: "Payment integration is not configured yet.",
      });
      return;
    }

    if (planId === "institution") {
      window.location.href = "mailto:sales@educonnect.com";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Flexible pricing for individuals and institutions with premium AI features
        </p>
        {selectedPlan === "premium" && (
          <p className="text-sm text-muted-foreground">
            Premium checkout will be available when billing is connected.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? "border-primary" : ""} ${plan.current ? "bg-primary/5" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 right-4">
                <Badge variant="secondary">Current Plan</Badge>
              </div>
            )}

            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <plan.icon className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="text-3xl font-bold">{plan.price}</div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="text-accent h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.current ? "secondary" : plan.popular ? "default" : "outline"}
                disabled={plan.current || plan.id === "free"}
                onClick={() => handlePlanSelect(plan.id)}
                data-testid={`button-plan-${plan.id}`}
              >
                {plan.current
                  ? "Current Plan"
                  : plan.id === "free"
                    ? "Get Started"
                    : plan.id === "institution"
                      ? "Contact Sales"
                      : "Start Premium"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center space-y-3">
          <h3 className="text-lg font-semibold flex items-center justify-center space-x-2">
            <Zap className="text-primary h-5 w-5" />
            <span>AI Credits System</span>
          </h3>
          <p className="text-muted-foreground">
            Use AI credits for personalized tutoring, automated grading, content generation, and smart
            recommendations. Credits can be purchased separately or included in your subscription plan.
          </p>
          <Button variant="outline" size="sm">
            Learn More About AI Features
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
