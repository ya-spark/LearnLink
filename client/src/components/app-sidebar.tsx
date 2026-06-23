import { GraduationCap, Home, BookOpen, Users, MessageCircle, Settings, BarChart3, Brain, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Marketplace",
        url: "/marketplace",
        icon: BookOpen,
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageCircle,
      },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        {
          title: "My Courses",
          url: "/my-courses",
          icon: BookOpen,
        },
        {
          title: "Progress",
          url: "/progress",
          icon: BarChart3,
        },
        {
          title: "AI Tutor",
          url: "/ai-tutor",
          icon: Brain,
        },
      ];
    } else if (user?.role === 'parent') {
      return [
        ...baseItems,
        {
          title: "My Children",
          url: "/children",
          icon: Users,
        },
        {
          title: "Progress Reports",
          url: "/reports",
          icon: BarChart3,
        },
      ];
    } else if (user?.role === 'educator' || user?.role === 'content_creator') {
      return [
        ...baseItems,
        {
          title: "My Courses",
          url: "/my-courses",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "/students",
          icon: Users,
        },
        {
          title: "Content Creation",
          url: "/create",
          icon: Brain,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: BarChart3,
        },
      ];
    } else if (user?.role === 'administrator') {
      return [
        ...baseItems,
        {
          title: "Institute Management",
          url: "/institute",
          icon: Users,
        },
        {
          title: "User Management",
          url: "/users",
          icon: Users,
        },
        {
          title: "System Analytics",
          url: "/system-analytics",
          icon: BarChart3,
        },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">EduConnect</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/subscribe">
                    <CreditCard className="h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => setLocation("/landing")}
          data-testid="button-logout"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
