import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BookOpen,
  Calculator,
  Clock,
  TrendingUp,
  Award,
  Bell,
  MessageSquare,
} from "lucide-react";
import type { PageNames } from "@/App";

export interface DashboardOverviewProps {
  onSectionChange: (section: PageNames) => void;
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Enrolled Courses",
      value: "12",
      description: "Current semester",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Current GPA",
      value: "3.67",
      description: "Cumulative GPA",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Credits Earned",
      value: "78",
      description: "Out of 120 required",
      icon: Award,
      color: "text-purple-600",
    },
    {
      title: "Pending Results",
      value: "3",
      description: "Awaiting publication",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const recentCourses = [
    { code: "CSC 301", title: "Database Systems", units: 3, status: "Ongoing" },
    {
      code: "CSC 305",
      title: "Software Engineering",
      units: 3,
      status: "Ongoing",
    },
    {
      code: "MTH 301",
      title: "Mathematical Methods",
      units: 2,
      status: "Completed",
    },
    {
      code: "STA 301",
      title: "Applied Statistics",
      units: 3,
      status: "Ongoing",
    },
  ];

  const quickActions = [
    {
      title: "Register Courses",
      description: "Add courses for new semester",
      icon: BookOpen,
      action: () => onSectionChange("registration"),
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Calculate GPA",
      description: "Compute semester/cumulative GPA",
      icon: Calculator,
      action: () => onSectionChange("results"),
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "View Notifications",
      description: "Check latest updates",
      icon: Bell,
      action: () => onSectionChange("notifications"),
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "SMS Center",
      description: "Send/receive messages",
      icon: MessageSquare,
      action: () => onSectionChange("messages"),
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome back, Onyekachi!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your academic progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-20 flex flex-col flex-1 items-center justify-center gap-2 ${action.color}`}
                    onClick={action.action}
                  >
                    <action.icon className="h-5 w-5" />
                    <div className="text-center">
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-xs opacity-70">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Academic Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Track your degree completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Degree Progress</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Semester</span>
                  <span>12/15 Credits</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Expected Graduation: June 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>
              Your enrolled courses this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{course.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{course.units} Units</Badge>
                    <Badge
                      variant={
                        course.status === "Completed" ? "default" : "outline"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
