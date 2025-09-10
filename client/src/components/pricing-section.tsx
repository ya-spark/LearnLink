import { Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic course access",
        "Progress tracking",
        "Community forums",
        "5 AI credits/month"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19",
      priceUnit: "/month",
      description: "Everything you need to excel",
      features: [
        "Unlimited course access",
        "Advanced analytics",
        "Priority support",
        "100 AI credits/month",
        "Content creation tools"
      ],
      buttonText: "Start Premium",
      buttonVariant: "default" as const,
      popular: true
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
        "Dedicated support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Learning Plan</h2>
          <p className="text-lg text-muted-foreground">
            Flexible pricing for individuals and institutions with premium AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-primary' : ''}`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.priceUnit && (
                      <span className="text-lg text-muted-foreground">{plan.priceUnit}</span>
                    )}
                  </div>
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
                  variant={plan.buttonVariant}
                  onClick={() => {
                    if (plan.id === 'institution') {
                      window.location.href = 'mailto:sales@educonnect.com';
                    } else {
                      window.location.href = '/api/login';
                    }
                  }}
                  data-testid={`button-${plan.id}`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Credits Info */}
        <Card className="mt-12 bg-primary/5 border-primary/20 max-w-3xl mx-auto">
          <CardContent className="p-6 text-center space-y-3">
            <h3 className="text-lg font-semibold flex items-center justify-center space-x-2">
              <Coins className="text-primary h-5 w-5" />
              <span>AI Credits System</span>
            </h3>
            <p className="text-muted-foreground">
              Use AI credits for personalized tutoring, automated grading, content generation, and smart recommendations. 
              Credits can be purchased separately or included in your subscription plan.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-learn-ai-features"
            >
              Learn More About AI Features
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
