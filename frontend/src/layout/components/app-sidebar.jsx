import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, LayoutDashboard, PlusSquare, List, TruckIcon, Settings, ArrowLeftRightIcon, UsersRoundIcon, Truck, Flower, MailQuestion, FileQuestion, ChartNoAxesGanttIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

// Updated JSON structure with parent-child relationships
const menuData = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",

  },
  {
    title: "Products",
    icon: LayoutDashboard,
    children: [
      { title: "products", icon: List, url: "/products" },
      { title: "product-form", icon: List, url: "/add-products"},
    
      { title: "Category", icon: ChartNoAxesGanttIcon, url: "/chemical-category" }
    ]
  },
  {
    title: "Supplier",
    icon: TruckIcon,
    children: [
      { title: "List", icon: List, url: "/supplier-table" },
      { title: "Add New", icon: PlusSquare, url: "/supplier-form" },
      { title: "Chemical Mapping ", icon: ArrowLeftRightIcon, url: "/chemical-mapping" },
      { title: "Search Chemicals", icon: Flower, url: "/chemical-search" }
    ]
  },
  {
    title: "Customer",
    icon: UsersRoundIcon,
    children: [
      { title: "List", icon: List, url: "/customer-table" },
      { title: "Add New", icon: PlusSquare, url: "/customer-form" },
      { title: "Chemical Mapping ", icon: ArrowLeftRightIcon, url: "/customer-chemical-mapping" },

    ]
  },
  {
    title: "Email",
    icon: UsersRoundIcon,
    children: [
      { title: "SMTP Setting", icon: List, url: "/smtp-table" },
      { title: "Email Template", icon: PlusSquare, url: "/email-template-table" },
      { title: "Send Email ", icon: ArrowLeftRightIcon, url: "/email-form" },
      { title: "Email Category", icon: ArrowLeftRightIcon, url: "/email-category" },
    ]
  },
  {
    title: "Inquiry",
    icon: FileQuestion,
    children: [
      { title: "List", icon: List, url: "/inquiry-list" },
      { title: "Add New", icon: PlusSquare, url: "/add-inquiry" },
      { title: "Inquiry Sources ", icon: List, url: "source-table" },
      { title: "Inquiry Status ", icon: List, url: "status-table" },

    ]
  },
  {
    title: "Website",
    icon: LayoutDashboard,
    children: [
      {
        title: "Logo", icon: List,
        children: [

          { title: "Logo Form", icon: PlusSquare, url: "/add-logo" },
        ]
      },
      {
        title: "Menu",
        icon: List,
        children: [
          { title: "Menu List", icon: List, url: "/menu-listing-table" },
          { title: "Add New", icon: PlusSquare, url: "/menu-listing-form" },
        ]
      },
      {
        title: "Blog",
        icon: List,
        children: [
          { title: "Blog Categories", icon: List, url: "/blog-category-table" },
          { title: "Blog", icon: PlusSquare, url: "/blog-table" },
          { title: "Blog Card", icon: PlusSquare, url: "/blogCard" },
        ]
      },
     
      {
        title: "Corporate",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/about-us-table" },
          // { title: "Add New", icon: PlusSquare, url: "/about-us-form" },
        ]
      },
      {
        title: "Banner",
        icon: FileQuestion,
        children: [
          {
            title: "List", icon: List, url:
              "/banner-table"
          },
          { title: "Add New", icon: PlusSquare, url: "/add-banner" },

        ]
      },
      {
        title: "Worldwide",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/worldwide-table" },
        ]
      },
      {
        title: "Career",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/career-table" },
          { title: "Career Info", icon: PlusSquare, url: "/career-info-form" },
        ]
      },
      {
        title: "Contact Info",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/contact-info-table" },
          // { title: "Add New", icon: PlusSquare, url: "/contact-info/add" },
        ]
      },
      {
        title: "Slide Show",
        icon: FileQuestion,
        children: [
          { title: "slideshow Table", icon: PlusSquare, url: "/slideShow-table" },
          { title: "slide show", icon: List, url: "/slideShow-form" },
        ]
      },
      {
        title: "WhatsUp Info",
        icon: FileQuestion,
        children: [
          // {title:"List",icon:List,url:"/whatsUpInfo-table"},
          { title: "Add New", icon: PlusSquare, url: "/whatsUpInfo-form" }
        ]
      },
      {
        title: "Events",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/events" },
        ]
      },
      {
        title: "Meta Info",
        icon: FileQuestion,
        children: [
          { title: "Meta List", icon: List, url: "/meta-table" },
          { title: "Meta Form", icon: List, url: "/meta-form" },
          // { title: "Add New", icon: PlusSquare, url: "/contact-info/add" },
        ]
      },
      {
        title: "Navigation Link",
        icon: FileQuestion,
        children: [
          { title: "List", icon: List, url: "/navigationLink" },
          { title: "Add New", icon: PlusSquare, url: "/navigationLink-form" },
        ]
      }, 
      {
        title:"catalogue Management",
        icon: FileQuestion,
        children:[
          {title:"Catalogue List",icon:List,url:"/catalogue-table"},
          // {title:"Add New",icon:PlusSquare,url:"/catalogue-form"}
        ]
      } ,
      {
        title: "PrivacyPolicy and Terms",
        icon: FileQuestion,
        children: [
          { title: "Privacy Policy", icon: List, url: "/privacypolicy-terms" },
          { title: "Terms and Condition", icon: PlusSquare, url: "/terms-and-conditions-form" },
        ]
      }
    ]
  }
];

export default function AppSidebar() {
  const [openSections, setOpenSections] = useState({});
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
                  <item.icon className="w-4 h-4" />
                  {item.title}
                  <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform hover:text-blue-600", { "-rotate-90": !openSections[item.title] })} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {renderMenuItems(item.children)}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuButton asChild>
              <Link to={item.url} className={`pl-4 flex items-center gap-2 hover:text-blue-600 ${activeClass}`}>
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>{renderMenuItems(menuData)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
     
    </Sidebar>
  );
}
