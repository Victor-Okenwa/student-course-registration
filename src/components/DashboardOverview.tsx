import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import * as api from "../lib/api";
import type { Enrollment } from "../lib/api";

export interface DashboardOverviewProps {
  onSectionChange: (section: PageNames) => void;
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  // For now, we'll use a hardcoded student ID. In a real app, this would come from authentication
  const currentUserId = 1; // TODO: Get from auth context

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await api.fetchUserEnrollments(currentUserId);
      setEnrollments(data.filter((e) => e.status === "ENROLLED"));
    } catch (error) {
      toast.error("Failed to load enrollment data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const enrolledCourses = enrollments.length;
  const totalCredits = enrollments.reduce((total, enrollment) => {
    return total + (enrollment.section?.course?.credits || 0);
  }, 0);

  // For Nigerian system: Calculate progress (assuming 120 credits for degree)
  const creditsEarned = 0; // This would come from completed courses with grades
  const degreeProgress = Math.round((creditsEarned / 120) * 100);
  const semesterProgress = Math.round((totalCredits / 24) * 100); // Assuming max 24 credits per semester

  const stats = [
    {
      title: "Enrolled Courses",
      value: String(enrolledCourses),
      description: "Current enrollments",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Credits",
      value: String(totalCredits),
      description: "This semester",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Credits Earned",
      value: String(creditsEarned),
      description: "Out of 120 required",
      icon: Award,
      color: "text-purple-600",
    },
    {
      title: "Waitlisted",
      value: String(
        enrollments.filter((e) => e.status === "WAITLISTED").length
      ),
      description: "Courses waiting",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  // Get current courses from enrollments
  const currentCourses = enrollments
    .filter((e) => e.status === "ENROLLED")
    .map((enrollment) => ({
      code: enrollment.section?.course?.code || "Unknown",
      title: enrollment.section?.course?.title || "Unknown Course",
      units: enrollment.section?.course?.credits || 0,
      status: "Ongoing" as const,
      room: enrollment.section?.room,
      term: enrollment.section?.term?.name,
    }))
    .slice(0, 10); // Show up to 10 courses

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
                  <span>{degreeProgress}%</span>
                </div>
                <Progress value={degreeProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {creditsEarned} of 120 credits completed
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Semester</span>
                  <span>{totalCredits}/24 Credits</span>
                </div>
                <Progress value={semesterProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {enrolledCourses} courses enrolled
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {totalCredits < 24
                    ? `You can register for ${24 - totalCredits} more credits`
                    : "Maximum credits reached for this semester"}
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading courses...</div>
            ) : currentCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No courses enrolled yet.</p>
                <Button onClick={() => onSectionChange("registration")}>
                  Register for Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentCourses.map((course, index) => (
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
                        {course.room && (
                          <p className="text-xs text-muted-foreground">
                            Room: {course.room} {course.term && `• ${course.term}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{course.units} Credits</Badge>
                      <Badge variant="outline">{course.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
