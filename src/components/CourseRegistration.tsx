import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import {
  Search,
  Filter,
  BookOpen,
  Plus,
  Minus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function CourseRegistration() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("300");
  const [selectedSession, setSelectedSession] = useState("2023/2024");

  const sessions = ["2023/2024", "2024/2025"];
  const levels = ["100", "200", "300", "400"];

  const availableCourses = [
    {
      code: "CSC 301",
      title: "Database Systems",
      units: 3,
      level: "300",
      semester: "1st",
      prerequisites: ["CSC 201"],
      status: "Available",
    },
    {
      code: "CSC 302",
      title: "Computer Networks",
      units: 3,
      level: "300",
      semester: "1st",
      prerequisites: ["CSC 202"],
      status: "Available",
    },
    {
      code: "CSC 305",
      title: "Software Engineering",
      units: 3,
      level: "300",
      semester: "1st",
      prerequisites: ["CSC 201"],
      status: "Available",
    },
    {
      code: "CSC 307",
      title: "Artificial Intelligence",
      units: 3,
      level: "300",
      semester: "2nd",
      prerequisites: ["CSC 205"],
      status: "Available",
    },
    {
      code: "MTH 301",
      title: "Mathematical Methods",
      units: 2,
      level: "300",
      semester: "1st",
      prerequisites: ["MTH 201"],
      status: "Full",
    },
    {
      code: "STA 301",
      title: "Applied Statistics",
      units: 3,
      level: "300",
      semester: "1st",
      prerequisites: ["MTH 101"],
      status: "Available",
    },
    {
      code: "PHY 301",
      title: "Quantum Physics",
      units: 3,
      level: "300",
      semester: "2nd",
      prerequisites: ["PHY 201"],
      status: "Available",
    },
    {
      code: "ENG 301",
      title: "Technical Writing",
      units: 2,
      level: "300",
      semester: "1st",
      prerequisites: [],
      status: "Available",
    },
  ];

  const registeredCourses = [
    { code: "CSC 301", title: "Database Systems", units: 3, semester: "1st" },
    {
      code: "CSC 305",
      title: "Software Engineering",
      units: 3,
      semester: "1st",
    },
    { code: "STA 301", title: "Applied Statistics", units: 3, semester: "1st" },
  ];

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.level === selectedLevel &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const toggleCourseSelection = (courseCode: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode],
    );
  };

  const totalSelectedUnits = selectedCourses.reduce((total, courseCode) => {
    const course = availableCourses.find((c) => c.code === courseCode);
    return total + (course?.units || 0);
  }, 0);

  const totalRegisteredUnits = registeredCourses.reduce(
    (total, course) => total + course.units,
    0,
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Course Registration</h1>
          <p className="text-muted-foreground">
            Register for courses based on your current level and session
          </p>
        </div>

        {/* Session and Level Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Academic Session</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session} value={session}>
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Registration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Registered Units:</span>
                  <span className="font-medium">{totalRegisteredUnits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Units:</span>
                  <span className="font-medium">{totalSelectedUnits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Max Units:</span>
                  <span className="font-medium">24</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Courses</TabsTrigger>
            <TabsTrigger value="registered">Registered Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Courses - Level {selectedLevel}</CardTitle>
                <CardDescription>
                  {filteredCourses.length} courses available for registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedCourses.includes(course.code)}
                          onCheckedChange={() =>
                            toggleCourseSelection(course.code)
                          }
                          disabled={course.status === "Full"}
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{course.code}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.title}
                            </p>
                            {course.prerequisites.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Prerequisites: {course.prerequisites.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{course.units} Units</Badge>
                        <Badge variant="outline">
                          {course.semester} Semester
                        </Badge>
                        <Badge
                          variant={
                            course.status === "Available"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {course.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCourses.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">
                        Selected Courses ({selectedCourses.length})
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Total Units: {totalSelectedUnits}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Register Selected Courses
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCourses([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registered" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Courses</CardTitle>
                <CardDescription>
                  Courses you are currently registered for this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registeredCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-green-600" />
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
                        <Badge variant="outline">
                          {course.semester} Semester
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">
                      Total Registered Units
                    </span>
                    <span className="text-lg font-bold text-green-800">
                      {totalRegisteredUnits} / 24
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
