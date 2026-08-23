export type WorkspaceTemplateItem = {
  title: string;
  url: string;
  icon_emoji: string | null;
};

export type WorkspaceTemplateSection = {
  title: string;
  items: WorkspaceTemplateItem[];
};

export type WorkspaceTemplate = {
  id: string;
  name: string;
  description: string;
  preview: string;
  theme_color: string;
  theme_bg: string;
  theme_font: string;
  title: string;
  subtitle: string;
  sections: WorkspaceTemplateSection[];
};

export const workspaceTemplates: WorkspaceTemplate[] = [
  {
    id: "personal",
    name: "Personal",
    description: "All your links in one place — socials, contact, about me.",
    preview: "👤",
    theme_color: "#6366f1",
    theme_bg: "#ffffff",
    theme_font: "system",
    title: "Hey, I'm {name}",
    subtitle: "Connect with me",
    sections: [
      {
        title: "Social",
        items: [
          { title: "Instagram", url: "https://instagram.com/", icon_emoji: "📸" },
          { title: "Twitter / X", url: "https://x.com/", icon_emoji: "🐦" },
          { title: "LinkedIn", url: "https://linkedin.com/in/", icon_emoji: "💼" },
          { title: "YouTube", url: "https://youtube.com/", icon_emoji: "🎬" },
        ],
      },
      {
        title: "More",
        items: [
          { title: "My Portfolio", url: "https://", icon_emoji: "🌐" },
          { title: "Email Me", url: "mailto:", icon_emoji: "✉️" },
        ],
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Showcase services, pricing, and contact info for your business.",
    preview: "🏢",
    theme_color: "#0ea5e9",
    theme_bg: "#f8fafc",
    theme_font: "system",
    title: "{Business Name}",
    subtitle: "Professional services & solutions",
    sections: [
      {
        title: "Services",
        items: [
          { title: "Web Development", url: "https://", icon_emoji: "💻" },
          { title: "Graphic Design", url: "https://", icon_emoji: "🎨" },
          { title: "SEO & Marketing", url: "https://", icon_emoji: "📈" },
        ],
      },
      {
        title: "Connect",
        items: [
          { title: "Book a Call", url: "https://calendly.com/", icon_emoji: "📞" },
          { title: "WhatsApp", url: "https://wa.me/", icon_emoji: "💬" },
          { title: "Email Us", url: "mailto:", icon_emoji: "✉️" },
          { title: "Google Maps", url: "https://maps.google.com/", icon_emoji: "📍" },
        ],
      },
      {
        title: "Follow Us",
        items: [
          { title: "Instagram", url: "https://instagram.com/", icon_emoji: "📸" },
          { title: "Facebook", url: "https://facebook.com/", icon_emoji: "👍" },
        ],
      },
    ],
  },
  {
    id: "creator",
    name: "Creator",
    description: "For content creators — your content, merch, and support links.",
    preview: "🎬",
    theme_color: "#e11d48",
    theme_bg: "#fff1f2",
    theme_font: "system",
    title: "{Creator Name}",
    subtitle: "Content · Merch · Community",
    sections: [
      {
        title: "Content",
        items: [
          { title: "YouTube Channel", url: "https://youtube.com/", icon_emoji: "📺" },
          { title: "Podcast", url: "https://", icon_emoji: "🎙️" },
          { title: "Blog", url: "https://", icon_emoji: "✍️" },
        ],
      },
      {
        title: "Shop",
        items: [
          { title: "Merch Store", url: "https://", icon_emoji: "🛍️" },
          { title: "Digital Products", url: "https://", icon_emoji: "📦" },
        ],
      },
      {
        title: "Support",
        items: [
          { title: "Buy Me a Coffee", url: "https://buymeacoffee.com/", icon_emoji: "☕" },
          { title: "Patreon", url: "https://patreon.com/", icon_emoji: "❤️" },
        ],
      },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Menu, reservations, location, and hours for your restaurant.",
    preview: "🍽️",
    theme_color: "#d97706",
    theme_bg: "#fffbeb",
    theme_font: "serif",
    title: "{Restaurant Name}",
    subtitle: "Taste the difference",
    sections: [
      {
        title: "Order & Menu",
        items: [
          { title: "View Menu", url: "https://", icon_emoji: "📋" },
          { title: "Order Online", url: "https://", icon_emoji: "🛒" },
          { title: "Zomato", url: "https://zomato.com/", icon_emoji: "🍜" },
        ],
      },
      {
        title: "Visit Us",
        items: [
          { title: "Reserve a Table", url: "https://", icon_emoji: "📅" },
          { title: "Google Maps", url: "https://maps.google.com/", icon_emoji: "📍" },
          { title: "Call Now", url: "tel:", icon_emoji: "📞" },
        ],
      },
      {
        title: "Hours",
        items: [
          { title: "Mon–Fri: 11am – 10pm", url: "#", icon_emoji: "🕐" },
          { title: "Sat–Sun: 10am – 11pm", url: "#", icon_emoji: "🕐" },
        ],
      },
    ],
  },
  {
    id: "event",
    name: "Event",
    description: "Conference, meetup, or festival — schedule, speakers, venue.",
    preview: "🎉",
    theme_color: "#7c3aed",
    theme_bg: "#f5f3ff",
    theme_font: "system",
    title: "{Event Name}",
    subtitle: "Date · Venue · Tickets",
    sections: [
      {
        title: "Info",
        items: [
          { title: "Schedule", url: "https://", icon_emoji: "🗓️" },
          { title: "Speakers", url: "https://", icon_emoji: "🎤" },
          { title: "Get Tickets", url: "https://", icon_emoji: "🎫" },
        ],
      },
      {
        title: "Venue",
        items: [
          { title: "Location & Maps", url: "https://maps.google.com/", icon_emoji: "📍" },
          { title: "Hotels Nearby", url: "https://", icon_emoji: "🏨" },
        ],
      },
      {
        title: "Connect",
        items: [
          { title: "Event Hashtag", url: "https://twitter.com/search?q=", icon_emoji: "💬" },
          { title: "Contact Organizers", url: "mailto:", icon_emoji: "✉️" },
        ],
      },
    ],
  },
  {
    id: "student",
    name: "Student",
    description: "Portfolio, resume, projects, and contact for job seekers.",
    preview: "🎓",
    theme_color: "#059669",
    theme_bg: "#ecfdf5",
    theme_font: "system",
    title: "{Your Name}",
    subtitle: "Computer Science · Portfolio",
    sections: [
      {
        title: "Work",
        items: [
          { title: "Portfolio", url: "https://", icon_emoji: "🌐" },
          { title: "GitHub", url: "https://github.com/", icon_emoji: "💻" },
          { title: "Resume / CV", url: "https://", icon_emoji: "📄" },
        ],
      },
      {
        title: "Projects",
        items: [
          { title: "Project 1", url: "https://", icon_emoji: "🚀" },
          { title: "Project 2", url: "https://", icon_emoji: "🔧" },
        ],
      },
      {
        title: "Contact",
        items: [
          { title: "LinkedIn", url: "https://linkedin.com/in/", icon_emoji: "💼" },
          { title: "Email", url: "mailto:", icon_emoji: "✉️" },
        ],
      },
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple — just your most important links.",
    preview: "✨",
    theme_color: "#171717",
    theme_bg: "#fafafa",
    theme_font: "system",
    title: "{Your Name}",
    subtitle: "",
    sections: [
      {
        title: "",
        items: [
          { title: "Website", url: "https://", icon_emoji: "🌐" },
          { title: "Instagram", url: "https://instagram.com/", icon_emoji: "📸" },
          { title: "Twitter / X", url: "https://x.com/", icon_emoji: "🐦" },
          { title: "Email", url: "mailto:", icon_emoji: "✉️" },
        ],
      },
    ],
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with a clean page.",
    preview: "📝",
    theme_color: "#6366f1",
    theme_bg: "#ffffff",
    theme_font: "system",
    title: "My Page",
    subtitle: "",
    sections: [],
  },
];
