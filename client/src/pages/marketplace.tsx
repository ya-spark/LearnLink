import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Marketplace() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

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

  const { data: subjects = [] } = useQuery({
    queryKey: ["/api/subjects"],
    enabled: isAuthenticated,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses", { gradeLevel: selectedGrade, subjectId: selectedSubject, search: searchTerm }],
    enabled: isAuthenticated,
  });

  const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
    { value: "11", label: "Grade 11" },
    { value: "12", label: "Grade 12" },
    { value: "college", label: "College+" },
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

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold" data-testid="text-marketplace-title">
          Course Marketplace
        </h1>
        <p className="text-muted-foreground">
          Discover quality educational content created by expert educators
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-courses"
            />
          </div>
          
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-grade">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Grades</SelectItem>
              {gradeOptions.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-subject">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {subjects.map((subject: any) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      {coursesLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: any) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover-elevate" data-testid={`card-course-${course.id}`}>
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-sm text-muted-foreground">Course Content</div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" data-testid={`badge-grade-${course.id}`}>
                      {gradeOptions.find(g => g.value === course.gradeLevel)?.label || course.gradeLevel}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 h-4 w-4 fill-current" />
                      <span className="text-sm text-muted-foreground">{course.rating || "0.0"}</span>
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
                          {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </span>
                    </div>
                    <span className="font-semibold text-accent" data-testid={`text-price-${course.id}`}>
                      ${course.price || "0.00"}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{course.enrollmentCount || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Self-paced</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
