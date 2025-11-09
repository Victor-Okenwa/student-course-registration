import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { Term, Course, Section, User } from "../lib/api";
import * as api from "../lib/api";

function LineChartMini({ points }: { points: number[] }) {
  const width = 320;
  const height = 80;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = (v: number) => (max === min ? height / 2 : height - ((v - min) / (max - min)) * height);
  const step = width / (points.length - 1 || 1);
  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${norm(v)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <path d={d} fill="none" stroke="currentColor" className="text-blue-600" strokeWidth="2" />
    </svg>
  );
}

function BarChartMini({ values }: { values: number[] }) {
  const width = 320;
  const height = 80;
  const max = Math.max(...values, 1);
  const barWidth = Math.max(8, Math.floor(width / (values.length * 1.5)));
  const gap = Math.floor(barWidth / 2);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      {values.map((v, i) => {
        const h = Math.round((v / max) * (height - 8));
        const x = i * (barWidth + gap);
        const y = height - h;
        return <rect key={i} x={x} y={y} width={barWidth} height={h} className="fill-green-600" rx={2} />;
      })}
    </svg>
  );
}

export function AdminDashboard() {
  const [term, setTerm] = useState<string>("2025 Fall");
  const [metrics, setMetrics] = useState<api.AdminMetricsResponse | null>(null);

  // Data states
  const [terms, setTerms] = useState<Term[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Loading states
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Form states
  const [termName, setTermName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCredits, setCourseCredits] = useState("");
  const [sectionCourseId, setSectionCourseId] = useState("");
  const [sectionTermId, setSectionTermId] = useState("");
  const [sectionRoom, setSectionRoom] = useState("");
  const [sectionCapacity, setSectionCapacity] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("STUDENT");
  const [notifyMode, setNotifyMode] = useState<"single" | "broadcast">("single");
  const [notifyUserId, setNotifyUserId] = useState<string>("");
  const [notifyTitle, setNotifyTitle] = useState<string>("");
  const [notifyMessage, setNotifyMessage] = useState<string>("");
  const [notifyCategory, setNotifyCategory] = useState<string>("system");
  const [notifyType, setNotifyType] = useState<string>("info");
  const [notifyPriority, setNotifyPriority] = useState<string>("low");

  // Edit states
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: number; name: string } | null>(null);

  // Search/filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filterUserRole, setFilterUserRole] = useState<string>("all");

  // Filtered data
  const filteredTerms = terms.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.code.toLowerCase().includes(searchCourse.toLowerCase()) ||
    c.title.toLowerCase().includes(searchCourse.toLowerCase())
  );

  const filteredSections = sections.filter((s) => {
    const matchesSearch =
      s.course?.code.toLowerCase().includes(searchSection.toLowerCase()) ||
      s.course?.title.toLowerCase().includes(searchSection.toLowerCase()) ||
      s.term?.name.toLowerCase().includes(searchSection.toLowerCase()) ||
      s.room?.toLowerCase().includes(searchSection.toLowerCase());
    return matchesSearch;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterUserRole === "all" || u.role === filterUserRole;
    return matchesSearch && matchesRole;
  });

  // Load metrics
  const loadMetrics = useCallback(async () => {
    try {
      const data = await api.fetchAdminMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load metrics:", error);
      // Fallback to static values on error
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const loadTerms = useCallback(async () => {
    setLoadingTerms(true);
    try {
      const data = await api.fetchTerms();
      setTerms(data);
    } catch (error) {
      toast.error("Failed to load terms");
      console.error(error);
    } finally {
      setLoadingTerms(false);
    }
  }, []);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const data = await api.fetchCourses();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
      console.error(error);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const loadSections = useCallback(async () => {
    setLoadingSections(true);
    try {
      const data = await api.fetchSections();
      setSections(data);
    } catch (error) {
      toast.error("Failed to load sections");
      console.error(error);
    } finally {
      setLoadingSections(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await api.fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    loadTerms();
    loadCourses();
    loadSections();
    loadUsers();
  }, [loadTerms, loadCourses, loadSections, loadUsers]);

  const handleCreateTerm = async () => {
    if (editingTerm) {
      handleUpdateTerm();
      return;
    }
    if (!termName.trim()) {
      toast.error("Term name is required");
      return;
    }
    try {
      await api.createTerm(termName.trim());
      toast.success("Term created successfully");
      setTermName("");
      await loadTerms();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create term";
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTerm(null);
    setEditingCourse(null);
    setEditingSection(null);
    setEditingUser(null);
    setTermName("");
    setCourseCode("");
    setCourseTitle("");
    setCourseCredits("");
    setSectionCourseId("");
    setSectionTermId("");
    setSectionRoom("");
    setSectionCapacity("");
    setUserName("");
    setUserEmail("");
    setUserRole("STUDENT");
  };

  const handleCreateCourse = async () => {
    if (editingCourse) {
      handleUpdateCourse();
      return;
    }
    if (!courseCode.trim() || !courseTitle.trim() || !courseCredits.trim()) {
      toast.error("All fields are required");
      return;
    }
    const credits = Number(courseCredits);
    if (isNaN(credits) || credits <= 0) {
      toast.error("Credits must be a positive number");
      return;
    }
    try {
      await api.createCourse(courseCode.trim(), courseTitle.trim(), credits);
      toast.success("Course created successfully");
      setCourseCode("");
      setCourseTitle("");
      setCourseCredits("");
      await loadCourses();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create course";
      toast.error(message);
    }
  };

  const handleCreateSection = async () => {
    if (editingSection) {
      handleUpdateSection();
      return;
    }
    if (!sectionCourseId || !sectionTermId) {
      toast.error("Course and Term are required");
      return;
    }
    const courseId = Number(sectionCourseId);
    const termId = Number(sectionTermId);
    const capacity = sectionCapacity ? Number(sectionCapacity) : undefined;
    
    if (isNaN(courseId) || isNaN(termId)) {
      toast.error("Invalid course or term selected");
      return;
    }
    if (capacity !== undefined && (isNaN(capacity) || capacity <= 0)) {
      toast.error("Capacity must be a positive number");
      return;
    }
    try {
      await api.createSection(
        courseId,
        termId,
        sectionRoom.trim() || undefined,
        capacity,
      );
      toast.success("Section created successfully");
      setSectionCourseId("");
      setSectionTermId("");
      setSectionRoom("");
      setSectionCapacity("");
      await loadSections();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create section";
      toast.error(message);
    }
  };

  const handleCreateUser = async () => {
    if (editingUser) {
      handleUpdateUser();
      return;
    }
    if (!userName.trim() || !userEmail.trim() || !userRole) {
      toast.error("All fields are required");
      return;
    }
    try {
      await api.createUser(userName.trim(), userEmail.trim(), userRole);
      toast.success("User created successfully");
      setUserName("");
      setUserEmail("");
      setUserRole("STUDENT");
      await loadUsers();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create user";
      toast.error(message);
    }
  };

  // Edit handlers
  const handleEditTerm = (term: Term) => {
    setEditingTerm(term);
    setTermName(term.name);
  };

  const handleUpdateTerm = async () => {
    if (!editingTerm || !termName.trim()) {
      toast.error("Term name is required");
      return;
    }
    try {
      await api.updateTerm(editingTerm.id, termName.trim());
      toast.success("Term updated successfully");
      setEditingTerm(null);
      setTermName("");
      await loadTerms();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update term";
      toast.error(message);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseCode(course.code);
    setCourseTitle(course.title);
    setCourseCredits(String(course.credits));
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !courseCode.trim() || !courseTitle.trim() || !courseCredits.trim()) {
      toast.error("All fields are required");
      return;
    }
    const credits = Number(courseCredits);
    if (isNaN(credits) || credits <= 0) {
      toast.error("Credits must be a positive number");
      return;
    }
    try {
      await api.updateCourse(editingCourse.id, courseCode.trim(), courseTitle.trim(), credits);
      toast.success("Course updated successfully");
      setEditingCourse(null);
      setCourseCode("");
      setCourseTitle("");
      setCourseCredits("");
      await loadCourses();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update course";
      toast.error(message);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionCourseId(String(section.courseId));
    setSectionTermId(String(section.termId));
    setSectionRoom(section.room || "");
    setSectionCapacity(section.capacity ? String(section.capacity) : "");
  };

  const handleUpdateSection = async () => {
    if (!editingSection || !sectionCourseId || !sectionTermId) {
      toast.error("Course and Term are required");
      return;
    }
    const courseId = Number(sectionCourseId);
    const termId = Number(sectionTermId);
    const capacity = sectionCapacity ? Number(sectionCapacity) : undefined;
    
    if (isNaN(courseId) || isNaN(termId)) {
      toast.error("Invalid course or term selected");
      return;
    }
    if (capacity !== undefined && (isNaN(capacity) || capacity <= 0)) {
      toast.error("Capacity must be a positive number");
      return;
    }
    try {
      await api.updateSection(
        editingSection.id,
        courseId,
        termId,
        sectionRoom.trim() || undefined,
        capacity,
      );
      toast.success("Section updated successfully");
      setEditingSection(null);
      setSectionCourseId("");
      setSectionTermId("");
      setSectionRoom("");
      setSectionCapacity("");
      await loadSections();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update section";
      toast.error(message);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !userName.trim() || !userEmail.trim() || !userRole) {
      toast.error("All fields are required");
      return;
    }
    try {
      await api.updateUser(editingUser.id, userName.trim(), userEmail.trim(), userRole);
      toast.success("User updated successfully");
      setEditingUser(null);
      setUserName("");
      setUserEmail("");
      setUserRole("STUDENT");
      await loadUsers();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update user";
      toast.error(message);
    }
  };

  // Delete handlers
  const handleDeleteTerm = async (id: number) => {
    try {
      await api.deleteTerm(id);
      toast.success("Term deleted successfully");
      await loadTerms();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete term";
      toast.error(message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await api.deleteCourse(id);
      toast.success("Course deleted successfully");
      await loadCourses();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete course";
      toast.error(message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      await api.deleteSection(id);
      toast.success("Section deleted successfully");
      await loadSections();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete section";
      toast.error(message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await api.deleteUser(id);
      toast.success("User deleted successfully");
      await loadUsers();
      loadMetrics();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSendNotification = async () => {
    if (!notifyTitle.trim() || !notifyMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }
    try {
      if (notifyMode === "single") {
        const idNum = Number(notifyUserId);
        if (!idNum || isNaN(idNum)) {
          toast.error("Select a valid student");
          return;
        }
        await api.adminCreateNotification(idNum, notifyTitle.trim(), notifyMessage.trim(), notifyCategory, notifyType, notifyPriority);
        toast.success("Notification sent to student");
      } else {
        await api.adminBroadcastToStudents(notifyTitle.trim(), notifyMessage.trim(), notifyCategory, notifyType, notifyPriority);
        toast.success("Broadcast sent to all students");
      }
      setNotifyTitle("");
      setNotifyMessage("");
      setNotifyUserId("");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to send notification";
      toast.error(message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Control center for terms, courses, sections, users and reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
              <CardDescription>Registered students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.totals.totalStudents ?? users.filter((u) => u.role === "STUDENT").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
              <CardDescription>Courses in catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.totalCourses ?? courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Sections</CardTitle>
              <CardDescription>Available sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.totalSections ?? sections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Enrollments</CardTitle>
              <CardDescription>Active enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.totalEnrollments ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Terms</CardTitle>
              <CardDescription>Academic terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.activeTerms ?? terms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Capacity Utilization</CardTitle>
              <CardDescription>Overall section usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.overallUtilization ?? 0}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Waitlisted</CardTitle>
              <CardDescription>Students waiting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.waitlisted ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Items needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totals.alerts ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Term Snapshot</CardTitle>
                  <CardDescription>Key indicators for the selected term</CardDescription>
                </div>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Capacity Utilization</div>
                      <div className="text-sm font-medium">{metrics?.totals.overallUtilization ?? 0}%</div>
                    </div>
                    <BarChartMini values={metrics?.seatUtilizationSeries ?? [0, 0, 0, 0, 0, 0, 0]} />
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Total Enrollments</div>
                      <div className="text-sm font-medium">{metrics?.totals.totalEnrollments ?? 0}</div>
                    </div>
                    <LineChartMini points={metrics?.enrollmentsSeries ?? [0, 0, 0, 0, 0, 0, 0]} />
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Waitlisted</div>
                      <div className="text-sm font-medium">{metrics?.totals.waitlisted ?? 0}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Students waiting for available seats
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                  <CardDescription>Key system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Instructors</span>
                      <span className="font-medium">{metrics?.totals.totalInstructors ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Full Sections</span>
                      <span className="font-medium">{metrics?.totals.fullSections ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Empty Sections</span>
                      <span className="font-medium">{metrics?.totals.emptySections ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dropped Enrollments</span>
                      <span className="font-medium">{metrics?.totals.droppedEnrollments ?? 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trend</CardTitle>
                  <CardDescription>Enrollment activity (last 7 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChartMini points={metrics?.enrollmentsSeries ?? [0, 0, 0, 0, 0, 0, 0]} />
                  <div className="mt-4 text-xs text-muted-foreground">
                    Total: {metrics?.totals.totalEnrollments ?? 0} enrollments
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messaging" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Messaging</CardTitle>
                <CardDescription>Send in-app notifications to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Mode</div>
                    <Select value={notifyMode} onValueChange={(v: "single" | "broadcast") => setNotifyMode(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single student</SelectItem>
                        <SelectItem value="broadcast">Broadcast to all students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {notifyMode === "single" && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Student</div>
                      <Select value={notifyUserId} onValueChange={setNotifyUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter((u) => u.role === "STUDENT")
                            .map((u) => (
                              <SelectItem key={u.id} value={String(u.id)}>
                                {u.name} ({u.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Category</div>
                    <Select value={notifyCategory} onValueChange={setNotifyCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Type</div>
                    <Select value={notifyType} onValueChange={setNotifyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Priority</div>
                    <Select value={notifyPriority} onValueChange={setNotifyPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Title" value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} />
                  <Input placeholder="Message" value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendNotification}>Send</Button>
                  <Button variant="outline" onClick={() => { setNotifyTitle(""); setNotifyMessage(""); setNotifyUserId(""); }}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Terms</CardTitle>
                <CardDescription>
                  {editingTerm ? `Editing: ${editingTerm.name}` : "Create and configure academic terms"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 2026 Spring"
                    value={termName}
                    onChange={(e) => setTermName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateTerm()}
                  />
                  <Button onClick={handleCreateTerm} disabled={loadingTerms}>
                    {editingTerm ? "Update Term" : "Add Term"}
                  </Button>
                  {editingTerm && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Terms ({filteredTerms.length} of {terms.length})</div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {filteredTerms.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-8 text-center border rounded">
                      {terms.length === 0 ? "No terms yet. Create one above." : "No terms match your search."}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredTerms.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded border hover:bg-accent/50">
                          <span className="font-medium">{t.name}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTerm(t)}
                              disabled={!!editingTerm}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ type: "term", id: t.id, name: t.name })}
                              disabled={!!editingTerm}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Catalog</CardTitle>
                <CardDescription>
                  {editingCourse ? `Editing: ${editingCourse.code}` : "Add or edit courses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Course code (e.g., CSC 301)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Credits"
                    type="number"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateCourse} disabled={loadingCourses}>
                    {editingCourse ? "Update Course" : "Add Course"}
                  </Button>
                  {editingCourse && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Courses ({filteredCourses.length} of {courses.length})</div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses by code or title..."
                      value={searchCourse}
                      onChange={(e) => setSearchCourse(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {filteredCourses.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-8 text-center border rounded">
                      {courses.length === 0 ? "No courses yet. Create one above." : "No courses match your search."}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredCourses.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 rounded border hover:bg-accent/50">
                          <div>
                            <div className="font-medium">{c.code}</div>
                            <div className="text-sm text-muted-foreground">{c.title} - {c.credits} credits</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCourse(c)}
                              disabled={!!editingCourse}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ type: "course", id: c.id, name: c.code })}
                              disabled={!!editingCourse}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
                <CardDescription>
                  {editingSection ? "Editing section" : "Assign instructors, rooms and capacities"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Select value={sectionCourseId} onValueChange={setSectionCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.code} - {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sectionTermId} onValueChange={setSectionTermId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Room (optional)"
                    value={sectionRoom}
                    onChange={(e) => setSectionRoom(e.target.value)}
                  />
                  <Input
                    placeholder="Capacity (optional)"
                    type="number"
                    value={sectionCapacity}
                    onChange={(e) => setSectionCapacity(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateSection} disabled={loadingSections}>
                    {editingSection ? "Update Section" : "Create Section"}
                  </Button>
                  {editingSection && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Sections ({filteredSections.length} of {sections.length})</div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search sections by course, term, or room..."
                      value={searchSection}
                      onChange={(e) => setSearchSection(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {filteredSections.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-8 text-center border rounded">
                      {sections.length === 0 ? "No sections yet. Create one above." : "No sections match your search."}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredSections.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded border hover:bg-accent/50">
                          <div>
                            <div className="font-medium">
                              {s.course?.code || `Course ${s.courseId}`} - {s.term?.name || `Term ${s.termId}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {s.room && `Room: ${s.room}`} {s.capacity && `• Capacity: ${s.capacity}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSection(s)}
                              disabled={!!editingSection}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ 
                                type: "section", 
                                id: s.id, 
                                name: `${s.course?.code || s.courseId} - ${s.term?.name || s.termId}` 
                              })}
                              disabled={!!editingSection}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  {editingUser ? `Editing: ${editingUser.name}` : "Students, instructors, admins"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateUser} disabled={loadingUsers}>
                    {editingUser ? "Update User" : "Add User"}
                  </Button>
                  {editingUser && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Users ({filteredUsers.length} of {users.length})</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search users by name, email, or role..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterUserRole} onValueChange={setFilterUserRole}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {filteredUsers.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-8 text-center border rounded">
                      {users.length === 0 ? "No users yet. Create one above." : "No users match your search."}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded border hover:bg-accent/50">
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-sm text-muted-foreground">{u.email} • {u.role}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(u)}
                              disabled={!!editingUser}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm({ type: "user", id: u.id, name: u.name })}
                              disabled={!!editingUser}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policies</CardTitle>
                <CardDescription>Add/drop windows, credit caps, prerequisites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input placeholder="Add/Drop Deadline (YYYY-MM-DD)" />
                  <Input placeholder="Max Credits per Term" />
                </div>
                <Button>Save Policies</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Enrollment, utilization, waitlists</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button>Export Enrollment CSV</Button>
                <Button variant="outline">Generate Waitlist Report</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteConfirm?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteConfirm) return;
                switch (deleteConfirm.type) {
                  case "term":
                    handleDeleteTerm(deleteConfirm.id);
                    break;
                  case "course":
                    handleDeleteCourse(deleteConfirm.id);
                    break;
                  case "section":
                    handleDeleteSection(deleteConfirm.id);
                    break;
                  case "user":
                    handleDeleteUser(deleteConfirm.id);
                    break;
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
