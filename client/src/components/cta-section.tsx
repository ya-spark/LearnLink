import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function CTASection() {
  const benefits = [
    "No credit card required",
    "14-day free trial",
    "Cancel anytime"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Transform Your Learning Experience?
          </h2>
          
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of students, parents, and educators already using EduConnect to achieve their educational goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transition-all transform hover:scale-105"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-start-trial"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all"
              onClick={() => window.location.href = 'mailto:demo@educonnect.com'}
              data-testid="button-schedule-demo"
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm opacity-80">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
