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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calculator,
  TrendingUp,
  Award,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";

interface CourseGrade {
  id: string;
  courseCode: string;
  courseTitle: string;
  units: number;
  grade: string;
  points: number;
}

export function ResultCalculator() {
  const [currentSemesterGrades, setCurrentSemesterGrades] = useState<
    CourseGrade[]
  >([
    {
      id: "1",
      courseCode: "CSC 301",
      courseTitle: "Database Systems",
      units: 3,
      grade: "A",
      points: 5,
    },
    {
      id: "2",
      courseCode: "CSC 305",
      courseTitle: "Software Engineering",
      units: 3,
      grade: "B",
      points: 4,
    },
    {
      id: "3",
      courseCode: "STA 301",
      courseTitle: "Applied Statistics",
      units: 3,
      grade: "A",
      points: 5,
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseTitle: "",
    units: "",
    grade: "",
  });

  const gradeScale = [
    { grade: "A", points: 5, range: "70-100" },
    { grade: "B", points: 4, range: "60-69" },
    { grade: "C", points: 3, range: "50-59" },
    { grade: "D", points: 2, range: "45-49" },
    { grade: "E", points: 1, range: "40-44" },
    { grade: "F", points: 0, range: "0-39" },
  ];

  const semesterHistory = [
    { semester: "100 Level - 1st Semester", gpa: 4.2, totalUnits: 18 },
    { semester: "100 Level - 2nd Semester", gpa: 3.8, totalUnits: 20 },
    { semester: "200 Level - 1st Semester", gpa: 4.0, totalUnits: 22 },
    { semester: "200 Level - 2nd Semester", gpa: 3.9, totalUnits: 21 },
    { semester: "300 Level - 1st Semester", gpa: 4.1, totalUnits: 19 },
  ];

  const calculateSemesterGPA = (grades: CourseGrade[]) => {
    const totalPoints = grades.reduce(
      (sum, course) => sum + course.points * course.units,
      0,
    );
    const totalUnits = grades.reduce((sum, course) => sum + course.units, 0);
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
  };

  const calculateCumulativeGPA = () => {
    const allSemesterPoints = semesterHistory.reduce(
      (total, sem) => total + sem.gpa * sem.totalUnits,
      0,
    );
    const currentSemesterPoints = currentSemesterGrades.reduce(
      (sum, course) => sum + course.points * course.units,
      0,
    );

    const allSemesterUnits = semesterHistory.reduce(
      (total, sem) => total + sem.totalUnits,
      0,
    );
    const currentSemesterUnits = currentSemesterGrades.reduce(
      (sum, course) => sum + course.units,
      0,
    );

    const totalPoints = allSemesterPoints + currentSemesterPoints;
    const totalUnits = allSemesterUnits + currentSemesterUnits;

    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";
  };

  const addNewCourse = () => {
    if (
      newCourse.courseCode &&
      newCourse.courseTitle &&
      newCourse.units &&
      newCourse.grade
    ) {
      const gradeInfo = gradeScale.find((g) => g.grade === newCourse.grade);
      const course: CourseGrade = {
        id: Date.now().toString(),
        courseCode: newCourse.courseCode,
        courseTitle: newCourse.courseTitle,
        units: parseInt(newCourse.units),
        grade: newCourse.grade,
        points: gradeInfo?.points || 0,
      };

      setCurrentSemesterGrades([...currentSemesterGrades, course]);
      setNewCourse({ courseCode: "", courseTitle: "", units: "", grade: "" });
    }
  };

  const removeCourse = (id: string) => {
    setCurrentSemesterGrades(
      currentSemesterGrades.filter((course) => course.id !== id),
    );
  };

  const updateCourseGrade = (id: string, grade: string) => {
    const gradeInfo = gradeScale.find((g) => g.grade === grade);
    setCurrentSemesterGrades(
      currentSemesterGrades.map((course) =>
        course.id === id
          ? { ...course, grade, points: gradeInfo?.points || 0 }
          : course,
      ),
    );
  };

  const currentSemesterGPA = calculateSemesterGPA(currentSemesterGrades);
  const cumulativeGPA = calculateCumulativeGPA();
  const totalUnitsEarned =
    semesterHistory.reduce((total, sem) => total + sem.totalUnits, 0) +
    currentSemesterGrades.reduce((sum, course) => sum + course.units, 0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">
            Results & GPA Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your semester and cumulative GPA
          </p>
        </div>

        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Semester GPA
              </CardTitle>
              <Calculator className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currentSemesterGPA}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current grades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cumulative GPA
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {cumulativeGPA}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall academic performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Units Earned
              </CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalUnitsEarned}
              </div>
              <p className="text-xs text-muted-foreground">
                Credit units completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">GPA Calculator</TabsTrigger>
            <TabsTrigger value="history">Academic History</TabsTrigger>
            <TabsTrigger value="grading">Grading System</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Add New Course */}
            <Card>
              <CardHeader>
                <CardTitle>Add Course Result</CardTitle>
                <CardDescription>
                  Enter course details and grade to calculate GPA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Course Code"
                    value={newCourse.courseCode}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, courseCode: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Course Title"
                    value={newCourse.courseTitle}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        courseTitle: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Units"
                    value={newCourse.units}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, units: e.target.value })
                    }
                  />
                  <Select
                    value={newCourse.grade}
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, grade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeScale.map((grade) => (
                        <SelectItem key={grade.grade} value={grade.grade}>
                          {grade.grade} ({grade.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addNewCourse} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Semester Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Current Semester Results</CardTitle>
                <CardDescription>
                  Semester GPA:{" "}
                  <span className="font-bold text-primary">
                    {currentSemesterGPA}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSemesterGrades.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.courseCode}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.courseTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{course.units} Units</Badge>
                        <Select
                          value={course.grade}
                          onValueChange={(value) =>
                            updateCourseGrade(course.id, value)
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeScale.map((grade) => (
                              <SelectItem key={grade.grade} value={grade.grade}>
                                {grade.grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Badge
                          variant={
                            course.points >= 4
                              ? "default"
                              : course.points >= 3
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {course.points} pts
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(course.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {currentSemesterGrades.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Units
                        </p>
                        <p className="text-lg font-bold">
                          {currentSemesterGrades.reduce(
                            (sum, course) => sum + course.units,
                            0,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Points
                        </p>
                        <p className="text-lg font-bold">
                          {currentSemesterGrades.reduce(
                            (sum, course) => sum + course.points * course.units,
                            0,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Semester GPA
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {currentSemesterGPA}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic History</CardTitle>
                <CardDescription>
                  Your semester-by-semester academic performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {semesterHistory.map((semester, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{semester.semester}</p>
                        <p className="text-sm text-muted-foreground">
                          {semester.totalUnits} units completed
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {semester.totalUnits} Units
                        </Badge>
                        <Badge
                          variant={
                            semester.gpa >= 4.0
                              ? "default"
                              : semester.gpa >= 3.0
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-right min-w-[60px]"
                        >
                          {semester.gpa.toFixed(2)} GPA
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">
                      Cumulative GPA
                    </span>
                    <span className="text-xl font-bold text-green-800">
                      {cumulativeGPA}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>University Grading System</CardTitle>
                <CardDescription>Grade scale and point values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradeScale.map((grade) => (
                    <div key={grade.grade} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            grade.points >= 4
                              ? "default"
                              : grade.points >= 3
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-lg px-3 py-1"
                        >
                          {grade.grade}
                        </Badge>
                        <span className="font-bold">{grade.points} pts</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Score: {grade.range}%
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    GPA Calculation Formula
                  </h4>
                  <p className="text-sm text-blue-700">
                    GPA = (Sum of Grade Points × Units) ÷ Total Units
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Example: If you get A(5pts) in 3-unit course and B(4pts) in
                    2-unit course: GPA = (5×3 + 4×2) ÷ (3+2) = 23 ÷ 5 = 4.6
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
