import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Parent, Grade 7 Student",
      rating: 5,
      content: "EduConnect has transformed how I track my daughter's progress. The parent dashboard gives me real-time insights into her learning journey.",
      avatar: "SC"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Grade 11 Student",
      rating: 5,
      content: "The AI-powered tutoring system has been incredible. It adapts to my learning style and helps me understand complex concepts easily.",
      avatar: "MJ"
    },
    {
      id: 3,
      name: "Dr. Lisa Rodriguez",
      role: "Mathematics Educator",
      rating: 5,
      content: "Creating and sharing content has never been easier. The marketplace feature has helped me reach students globally.",
      avatar: "LR"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Educational Communities</h2>
          <p className="text-lg text-muted-foreground">
            See how EduConnect transforms learning experiences for students, parents, and educators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} data-testid={`testimonial-${testimonial.id}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold" data-testid={`testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
