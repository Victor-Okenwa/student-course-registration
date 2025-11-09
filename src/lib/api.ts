const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Auth
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(error.error || `Login failed: ${res.status}`);
  }
  return res.json();
}

export async function currentUser(): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Failed to load current user: ${res.status}`);
  return res.json();
}

export interface AdminMetricsResponse {
  seatUtilizationSeries: number[];
  registrationErrorSeries: number[];
  enrollmentsSeries: number[];
  departmentUtilization: { computerScience: number[]; mathematics: number[] };
  totals: {
    totalStudents: number;
    totalCourses: number;
    totalSections: number;
    activeTerms: number;
    totalEnrollments: number;
    waitlisted: number;
    droppedEnrollments: number;
    totalInstructors: number;
    totalAdmins: number;
    overallUtilization: number;
    fullSections: number;
    emptySections: number;
    openSections: number;
    alerts: number;
  };
}

export interface Term {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  credits: number;
}

export interface Section {
  id: number;
  courseId: number;
  termId: number;
  instructorId?: number | null;
  room?: string | null;
  capacity?: number | null;
  course?: Course;
  term?: Term;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Admin Metrics
export async function fetchAdminMetrics(): Promise<AdminMetricsResponse> {
  const res = await fetch(`${API_BASE}/admin/metrics`);
  if (!res.ok) throw new Error(`Failed to load metrics: ${res.status}`);
  return res.json();
}

// Terms
export async function fetchTerms(): Promise<Term[]> {
  const res = await fetch(`${API_BASE}/terms`);
  if (!res.ok) throw new Error(`Failed to load terms: ${res.status}`);
  return res.json();
}

export async function createTerm(name: string): Promise<Term> {
  const res = await fetch(`${API_BASE}/terms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create term" }));
    throw new Error(error.error || `Failed to create term: ${res.status}`);
  }
  return res.json();
}

export async function updateTerm(id: number, name: string): Promise<Term> {
  const res = await fetch(`${API_BASE}/terms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update term" }));
    throw new Error(error.error || `Failed to update term: ${res.status}`);
  }
  return res.json();
}

export async function deleteTerm(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/terms/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete term" }));
    throw new Error(error.error || `Failed to delete term: ${res.status}`);
  }
}

// Courses
export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error(`Failed to load courses: ${res.status}`);
  return res.json();
}

export async function createCourse(code: string, title: string, credits: number): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, title, credits }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create course" }));
    throw new Error(error.error || `Failed to create course: ${res.status}`);
  }
  return res.json();
}

export async function updateCourse(id: number, code: string, title: string, credits: number): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, title, credits }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update course" }));
    throw new Error(error.error || `Failed to update course: ${res.status}`);
  }
  return res.json();
}

export async function deleteCourse(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete course" }));
    throw new Error(error.error || `Failed to delete course: ${res.status}`);
  }
}

// Sections
export async function fetchSections(): Promise<Section[]> {
  const res = await fetch(`${API_BASE}/sections`);
  if (!res.ok) throw new Error(`Failed to load sections: ${res.status}`);
  return res.json();
}

export async function createSection(
  courseId: number,
  termId: number,
  room?: string,
  capacity?: number,
  instructorId?: number,
): Promise<Section> {
  const res = await fetch(`${API_BASE}/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, termId, room, capacity, instructorId }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create section" }));
    throw new Error(error.error || `Failed to create section: ${res.status}`);
  }
  return res.json();
}

export async function updateSection(
  id: number,
  courseId: number,
  termId: number,
  room?: string,
  capacity?: number,
  instructorId?: number,
): Promise<Section> {
  const res = await fetch(`${API_BASE}/sections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, termId, room, capacity, instructorId }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update section" }));
    throw new Error(error.error || `Failed to update section: ${res.status}`);
  }
  return res.json();
}

export async function deleteSection(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/sections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete section" }));
    throw new Error(error.error || `Failed to delete section: ${res.status}`);
  }
}

// Users
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
  return res.json();
}

export async function createUser(name: string, email: string, role: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ name, email, role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create user" }));
    throw new Error(error.error || `Failed to create user: ${res.status}`);
  }
  return res.json();
}

export async function updateUser(id: number, name: string, email: string, role: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ name, email, role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update user" }));
    throw new Error(error.error || `Failed to update user: ${res.status}`);
  }
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete user" }));
    throw new Error(error.error || `Failed to delete user: ${res.status}`);
  }
}

// Enrollments
export interface Enrollment {
  id: number;
  userId: number;
  sectionId: number;
  status: string;
  createdAt: string;
  user?: User;
  section?: Section;
}

export async function fetchEnrollments(): Promise<Enrollment[]> {
  const res = await fetch(`${API_BASE}/enrollments`);
  if (!res.ok) throw new Error(`Failed to load enrollments: ${res.status}`);
  return res.json();
}

export async function fetchUserEnrollments(userId: number): Promise<Enrollment[]> {
  const res = await fetch(`${API_BASE}/enrollments/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to load user enrollments: ${res.status}`);
  return res.json();
}

export async function createEnrollment(userId: number, sectionId: number): Promise<Enrollment> {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ userId, sectionId }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create enrollment" }));
    throw new Error(error.error || `Failed to create enrollment: ${res.status}`);
  }
  return res.json();
}

export async function updateEnrollment(id: number, status: string): Promise<Enrollment> {
  const res = await fetch(`${API_BASE}/enrollments/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update enrollment" }));
    throw new Error(error.error || `Failed to update enrollment: ${res.status}`);
  }
  return res.json();
}

export async function deleteEnrollment(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/enrollments/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete enrollment" }));
    throw new Error(error.error || `Failed to delete enrollment: ${res.status}`);
  }
}

// Notifications
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  category?: string | null;
  type?: string | null;
  read: boolean;
  priority?: string | null;
  createdAt: string;
}

export async function fetchMyNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Failed to load notifications: ${res.status}`);
  return res.json();
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to mark notification read: ${res.status}`);
  return res.json();
}

export async function adminCreateNotification(
  userId: number,
  title: string,
  message: string,
  category?: string,
  type?: string,
  priority?: string,
): Promise<Notification> {
  const res = await fetch(`${API_BASE}/notifications/user/${userId}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ title, message, category, type, priority }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to create notification" }));
    throw new Error(error.error || `Failed to create notification: ${res.status}`);
  }
  return res.json();
}

export async function adminBroadcastToStudents(
  title: string,
  message: string,
  category?: string,
  type?: string,
  priority?: string,
): Promise<{ count: number }> {
  const res = await fetch(`${API_BASE}/notifications/broadcast/students`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ title, message, category, type, priority }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to broadcast" }));
    throw new Error(error.error || `Failed to broadcast: ${res.status}`);
  }
  return res.json();
}


