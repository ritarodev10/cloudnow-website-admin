"use client";

import {
  AlertCircleIcon,
  ArrowRightLeftIcon,
  BookOpenTextIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  ClipboardListIcon,
  CrownIcon,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  QuoteIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { ThemedCloudNowLogo } from "@/components/icons/ThemedCloudNowLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper component for unavailable menu items
function UnavailableMenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <SidebarMenuItem>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              asChild
              className="opacity-60 hover:opacity-80 transition-opacity"
            >
              <a href={href} className="group">
                <Icon className="group-hover:hidden" />
                <AlertCircleIcon className="hidden group-hover:block text-amber-500" />
                <span>{label}</span>
              </a>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  );
}

// Helper component for available menu items
function AvailableMenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={href}>
          <Icon />
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarContent className="flex flex-col h-full max-h-screen">
        {/* Fixed logo section */}
        <div className="flex flex-col justify-center pt-4 pb-2">
          <ThemedCloudNowLogo width={200} />
        </div>

        {/* Scrollable menu section */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <AvailableMenuItem
                  icon={LayoutDashboardIcon}
                  label="Dashboard"
                  href="/dashboard"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <AvailableMenuItem
                  icon={FileTextIcon}
                  label="Blog Posts"
                  href="/content/blog-posts"
                />
                <UnavailableMenuItem
                  icon={BriefcaseIcon}
                  label="Services"
                  href="/content/services"
                />
                <UnavailableMenuItem
                  icon={QuoteIcon}
                  label="Testimonials"
                  href="/content/testimonials"
                />
                <UnavailableMenuItem
                  icon={MessageSquareTextIcon}
                  label="FAQs"
                  href="/content/faqs"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Website Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <UnavailableMenuItem
                  icon={ClipboardListIcon}
                  label="Form Submissions"
                  href="/forms/submissions"
                />
                <UnavailableMenuItem
                  icon={BriefcaseIcon}
                  label="Jobs"
                  href="/careers/jobs"
                />
                <UnavailableMenuItem
                  icon={UsersIcon}
                  label="Applications"
                  href="/careers/applications"
                />
                <UnavailableMenuItem
                  icon={ArrowRightLeftIcon}
                  label="Redirects"
                  href="/seo/redirects"
                />
                <UnavailableMenuItem
                  icon={GlobeIcon}
                  label="Sitemap"
                  href="/seo/sitemap"
                />
                <UnavailableMenuItem
                  icon={HomeIcon}
                  label="Menus"
                  href="/navigation/menus"
                />
                <UnavailableMenuItem
                  icon={ImageIcon}
                  label="Media Library"
                  href="/media/library"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Premium Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <UnavailableMenuItem
                  icon={CrownIcon}
                  label="Subscribers"
                  href="/premium/subscribers"
                />
                <UnavailableMenuItem
                  icon={StarIcon}
                  label="Premium Content"
                  href="/premium/content"
                />
                <UnavailableMenuItem
                  icon={ClipboardListIcon}
                  label="Subscription Plans"
                  href="/premium/plans"
                />
                <UnavailableMenuItem
                  icon={LayoutDashboardIcon}
                  label="Subscription Analytics"
                  href="/premium/analytics"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <UnavailableMenuItem
                  icon={SettingsIcon}
                  label="Site Settings"
                  href="/settings/site"
                />
                <UnavailableMenuItem
                  icon={CalendarClockIcon}
                  label="Integrations"
                  href="/settings/integrations"
                />
                <UnavailableMenuItem
                  icon={UsersIcon}
                  label="Staff"
                  href="/users/staff"
                />
                <UnavailableMenuItem
                  icon={ClipboardListIcon}
                  label="Activity Log"
                  href="/logs/activity"
                />
                <UnavailableMenuItem
                  icon={UsersIcon}
                  label="Visitor Log"
                  href="/logs/visitor"
                />
                <UnavailableMenuItem
                  icon={BookOpenTextIcon}
                  label="Help & Docs"
                  href="/help/docs"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Fixed account section */}
        <div className="flex-shrink-0 border-t pt-2 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full focus:outline-none">
              <div className="flex items-center px-3 py-2 mx-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200">
                <div className="flex items-center justify-center bg-primary/10 rounded-full w-9 h-9 mr-3">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-grow text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-[10px]">Administrator</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="center"
              alignOffset={-40}
              className="w-56 p-1 shadow-md"
              style={{ transform: "translate(10px, -10px)" }}
            >
              <DropdownMenuItem className="py-2 px-3 rounded-sm">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 rounded-sm">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 rounded-sm">
                <MessageSquareTextIcon className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 focus:text-red-500 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-sm">
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </SidebarComponent>
  );
}
