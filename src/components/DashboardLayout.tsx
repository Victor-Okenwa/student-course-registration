import React from "react";
import {
  Bell,
  BookOpen,
  Calculator,
  Home,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import IMTLogo from "../assets/imt-logo.svg";
import UNNLogo from "../assets/unn-logo.svg";
import type { PageNames } from "@/App";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: PageNames) => void;
}

export function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "registration", label: "Course Registration", icon: BookOpen },
    { id: "results", label: "Results & Calculator", icon: Calculator },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "messages", label: "SMS Center", icon: MessageSquare },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar collapsible="offcanvas" className="border-r">
          {/* Logo/Header */}
          <SidebarHeader className="p-6 border-b border-border">
            <div className="rounded-lg flex items-center justify-between">
              <img src={UNNLogo} className="w-8 h-10" alt="unn" />
              <img src={IMTLogo} className="size-8" alt="imt" />
            </div>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent className="space-y-2">
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onSectionChange(item.id as PageNames)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start h-11"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </SidebarMenuButton>
                      {item.id === "notifications" && (
                        <Badge
                          variant="destructive"
                          className="rounded-full text-[10px] absolute top-0 px-1.5"
                        >
                          3
                        </Badge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User Profile */}
          <SidebarFooter className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>NO</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Nnaemena Onyekachi</p>
                <p className="text-sm text-muted-foreground">Level 400</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="log out">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure want to logout?</DialogTitle>
                    <DialogDescription className="sr-only">
                      logout from app
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button asChild>
                      <a href="/">Yes</a>
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">No</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 items-center gap-2 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
