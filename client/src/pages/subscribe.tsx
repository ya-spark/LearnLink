import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Users, Zap } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are subscribed!",
      });
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button type="submit" className="w-full" disabled={!stripe}>
            Subscribe Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'institution'>('premium');

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

  useEffect(() => {
    if (isAuthenticated) {
      // Create subscription as soon as the page loads
      apiRequest("POST", "/api/get-or-create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
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
            title: "Error",
            description: "Failed to initialize subscription",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated, toast]);

  const pricingPlans = [
    {
      id: 'free',
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Basic course access',
        'Progress tracking',
        'Community forums',
        '5 AI credits/month'
      ],
      icon: Users,
      current: user?.subscriptionStatus === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19/month',
      description: 'Everything you need to excel',
      features: [
        'Unlimited course access',
        'Advanced analytics',
        'Priority support',
        '100 AI credits/month',
        'Content creation tools'
      ],
      icon: Crown,
      popular: true,
      current: user?.subscriptionStatus === 'premium'
    },
    {
      id: 'institution',
      name: 'Institution',
      price: 'Custom',
      description: 'For schools and organizations',
      features: [
        'Everything in Premium',
        'Multi-user management',
        'Custom branding',
        'Unlimited AI credits',
        'Dedicated support'
      ],
      icon: Zap,
      current: user?.subscriptionStatus === 'institution'
    }
  ];

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

  if (!clientSecret) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Flexible pricing for individuals and institutions with premium AI features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-primary' : ''} ${plan.current ? 'bg-primary/5' : ''}`}
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
                  disabled={plan.current}
                  onClick={() => {
                    if (plan.id === 'premium') {
                      setSelectedPlan('premium');
                    } else if (plan.id === 'institution') {
                      window.location.href = 'mailto:sales@educonnect.com';
                    }
                  }}
                  data-testid={`button-plan-${plan.id}`}
                >
                  {plan.current ? 'Current Plan' : 
                   plan.id === 'free' ? 'Get Started' :
                   plan.id === 'institution' ? 'Contact Sales' : 'Start Premium'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Credits Info */}
        <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <h3 className="text-lg font-semibold flex items-center justify-center space-x-2">
              <Zap className="text-primary h-5 w-5" />
              <span>AI Credits System</span>
            </h3>
            <p className="text-muted-foreground">
              Use AI credits for personalized tutoring, automated grading, content generation, and smart recommendations. 
              Credits can be purchased separately or included in your subscription plan.
            </p>
            <Button variant="outline" size="sm">
              Learn More About AI Features
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Complete Your Subscription</h1>
        <p className="text-muted-foreground">
          You're just one step away from unlocking premium features
        </p>
      </div>
      
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <SubscribeForm />
      </Elements>
    </div>
  );
}
