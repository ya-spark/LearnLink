import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MarketplaceSection() {
  const [activeCategory, setActiveCategory] = useState("All Subjects");

  const categories = [
    "All Subjects",
    "Mathematics", 
    "Science",
    "Literature",
    "History",
    "Languages"
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Advanced Calculus: Derivatives and Integration",
      description: "Master calculus concepts with step-by-step guidance and real-world applications.",
      grade: "Grade 11-12",
      rating: 4.8,
      instructor: "Dr. Smith",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=240",
      alt: "Advanced mathematics course content"
    },
    {
      id: 2,
      title: "Introduction to Chemistry: Lab Experiments",
      description: "Hands-on chemistry experiments with virtual lab simulations and safety protocols.",
      grade: "Grade 9-10",
      rating: 4.9,
      instructor: "Prof. Johnson",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=240",
      alt: "Chemistry laboratory experiments"
    },
    {
      id: 3,
      title: "English Literature: Classic Novels",
      description: "Explore timeless literature with guided analysis and discussion activities.",
      grade: "Grade 8-9",
      rating: 4.7,
      instructor: "Ms. Davis",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=240",
      alt: "Classical literature and reading materials"
    },
    {
      id: 4,
      title: "World History: Ancient Civilizations",
      description: "Journey through ancient civilizations with interactive timelines and virtual tours.",
      grade: "Grade 6-8",
      rating: 4.6,
      instructor: "Mr. Wilson",
      price: "$34.99",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=240",
      alt: "Historical documents and educational materials"
    }
  ];

  return (
    <section className="py-20 bg-background" id="marketplace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover Quality Educational Content</h2>
          <p className="text-lg text-muted-foreground">
            Browse our marketplace of courses and materials created by expert educators.
          </p>
        </div>

        {/* Course Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
              data-testid={`button-category-${category.toLowerCase().replace(' ', '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <Card 
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover-elevate"
              data-testid={`card-course-${course.id}`}
            >
              <img 
                src={course.image}
                alt={course.alt}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {course.grade}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 text-sm h-4 w-4 fill-current" />
                    <span className="text-sm text-muted-foreground">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold line-clamp-2" data-testid={`text-course-title-${course.id}`}>
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{course.instructor}</span>
                  </div>
                  <span className="font-semibold text-accent" data-testid={`text-price-${course.id}`}>
                    {course.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/marketplace'}
            data-testid="button-view-all-courses"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
