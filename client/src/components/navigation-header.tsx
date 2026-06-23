import { useState } from "react";
import { GraduationCap, Search, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavigationHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="text-primary text-2xl h-8 w-8" />
              <span className="text-xl font-bold text-primary">EduConnect</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <a href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</a>
              <a href="#institutes" className="text-muted-foreground hover:text-foreground transition-colors">Institutes</a>
              <a href="#educators" className="text-muted-foreground hover:text-foreground transition-colors">For Educators</a>
              <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Search courses..." 
                  className="w-64"
                  data-testid="input-search"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  data-testid="button-close-search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild data-testid="button-sign-in">
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button asChild data-testid="button-get-started">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <a href="#courses" className="text-foreground hover:text-primary transition-colors">Courses</a>
                  <a href="#institutes" className="text-foreground hover:text-primary transition-colors">Institutes</a>
                  <a href="#educators" className="text-foreground hover:text-primary transition-colors">For Educators</a>
                  <a href="#resources" className="text-foreground hover:text-primary transition-colors">Resources</a>
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard">Sign In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
