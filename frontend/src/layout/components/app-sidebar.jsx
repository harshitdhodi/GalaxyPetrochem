import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

// Helper function to get icon component by name
const getIconComponent = (iconName) => {
  const IconComponent = LucideIcons[iconName] || LucideIcons["LayoutDashboard"];
  return <IconComponent className="w-4 h-4" />;
};

// Updated JSON structure with icon names instead of components
const menuData = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    url: "/dashboard",
  },
  {
    title: "Products",
    icon: "LayoutDashboard",
    children: [
      { title: "products", icon: "List", url: "/products-table" },
      { title: "product-form", icon: "List", url: "/products/add"},
      { title: "Category", icon: "ChartNoAxesGantt", url: "/chemical-category" }
    ]
  },
  {
    title: "Inquiry",
    icon: "FileQuestion",
    children: [
      { title: "List", icon: "List", url: "/inquiry-list" },
      { title: "Add New", icon: "Plus", url: "/add-inquiry" },
    ]
  },
  {
    title: "Website",
    icon: "Globe",
    children: [
      {
        title: "Banner",
        icon: "Image",
        children: [
          { title: "List", icon: "List", url: "/banner-table" },
          { title: "Add New", icon: "Plus", url: "/add-banner" },
          { title: "Brands", icon: "Tag", url: "/brands-list" },
        ]
      },
      {
        title: "Logo", 
        icon: "Image",
        children: [
          { title: "Logo Form", icon: "Upload", url: "/add-logo" },
        ]
      },
      {
        title: "About Us",
        icon: "Info",
        children: [
          { title: "List", icon: "List", url: "/about-us-table" },
        ]
      },
      {
        title: "Menu",
        icon: "Menu",
        children: [
          { title: "Menu List", icon: "List", url: "/menu-listing-table" },
          { title: "Add New", icon: "Plus", url: "/menu-listing-form" },
        ]
      },
      {
        title: "Blog",
        icon: "Newspaper",
        children: [
          { title: "Blog Categories", icon: "List", url: "/blog-category-table" },
          { title: "Blog", icon: "FileText", url: "/blog-table" },
          { title: "Blog Card", icon: "CreditCard", url: "/blogCard" },
        ]
      },
      {
        title: "Brands",
        icon: "Tag",
        children: [
          { title: "List", icon: "List", url: "/brands-list" },
        ]
      },
      {
        title: "Contact Info",
        icon: "Info",
        children: [
          { title: "List", icon: "List", url: "/contact-info-table" },
        ]
      },
      {
        title: "Testimonial Table",
        icon: "Info",
        children: [
          { title: "List", icon: "List", url: "/testimonial-table" },
        ]
      },
      {
        title: "Meta Info",
        icon: "Info",
        children: [
          { title: "Meta List", icon: "List", url: "/meta-table" },
          { title: "Meta Form", icon: "List", url: "/meta-form" },
        ]
      },
      {
        title: "catalogue Management",
        icon: "Info",
        children: [
          { title: "Catalogue List", icon: "List", url: "/catalogue-table" },
        ]
      },
      {
        title: "WhatsUp Info",
        icon: "Info",
        children: [
          { title: "Add New", icon: "Plus", url: "/whatsUpInfo-form" }
        ]
      },
      {
        title: "PrivacyPolicy and Terms",
        icon: "Info",
        children: [
          { title: "Privacy Policy", icon: "List", url: "/privacypolicy-terms" },
          { title: "Terms and Condition", icon: "List", url: "/terms-and-conditions-form" },
        ]
      }
    ]
  }
];

export default function AppSidebar() {
  // Initialize openSections with "Website" set to true
  const [openSections, setOpenSections] = useState({ Website: true });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };
  const location = useLocation();

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (url) => location.pathname === url;

  const renderMenuItems = (items) =>
    items.map((item) => {
      const isParentActive = item.children?.some((child) => isActive(child.url));
      const isChildActive = isActive(item.url);
      const activeClass = isParentActive || isChildActive ? "text-blue-600" : "text-gray-600";

      return (
        <SidebarMenuItem key={item.title}>
          {item.children?.length ? (
            <Collapsible open={openSections[item.title]} onOpenChange={() => toggleSection(item.title)}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`w-full justify-start gap-2 hover:text-blue-600 font-normal ${activeClass}`}>
                  {item.icon && getIconComponent(item.icon)}
                  {item.title}
                  <LucideIcons.ChevronDown className={cn("w-4 h-4 ml-auto transition-transform hover:text-blue-600", { "-rotate-90": !openSections[item.title] })} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {renderMenuItems(item.children)}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuButton asChild>
              <Link to={item.url} className={`pl-4 flex items-center gap-2 hover:text-blue-600 ${activeClass}`}>
                {item.icon && getIconComponent(item.icon)}
                {item.title}
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>{renderMenuItems(menuData)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}