import { GraduationCap, Twitter, Facebook, Linkedin, Instagram, Shield } from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Courses", href: "/marketplace" },
        { name: "Instructors", href: "/instructors" },
        { name: "Institutes", href: "/institutes" },
        { name: "Mobile App", href: "/mobile" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Community", href: "/community" },
        { name: "System Status", href: "/status" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/educonnect", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/educonnect", label: "Facebook" },
    { icon: Linkedin, href: "https://linkedin.com/company/educonnect", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/educonnect", label: "Instagram" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="text-primary text-2xl h-8 w-8" />
              <span className="text-xl font-bold text-primary">EduConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering education through technology. Connect, learn, and grow with our comprehensive learning platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`link-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EduConnect. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Powered by AI</span>
            <div className="flex items-center space-x-2">
              <Shield className="text-accent h-4 w-4" />
              <span className="text-sm text-muted-foreground">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
