import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Search, BookOpen, Plus, Minus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import * as api from "../lib/api";
import type { Section, Term, Enrollment } from "../lib/api";

export function CourseRegistration() {
  // For now, we'll use a hardcoded student ID. In a real app, this would come from authentication
  const currentUserId = 1; // TODO: Get from auth context

  const [sections, setSections] = useState<Section[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sectionsData, termsData, enrollmentsData] = await Promise.all([
        api.fetchSections(),
        api.fetchTerms(),
        api.fetchUserEnrollments(currentUserId),
      ]);
      setSections(sectionsData);
      setTerms(termsData);
      setEnrollments(enrollmentsData);
      if (termsData.length > 0 && !selectedTermId) {
        setSelectedTermId(String(termsData[0].id));
      }
    } catch (error) {
      toast.error("Failed to load course data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Get available sections for selected term
  const availableSections = sections.filter((s) => {
    if (selectedTermId && String(s.termId) !== selectedTermId) return false;
    
    // Check if already enrolled
    const isEnrolled = enrollments.some(
      (e) => e.sectionId === s.id && e.status === "ENROLLED"
    );
    if (isEnrolled) return false;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        s.course?.code.toLowerCase().includes(search) ||
        s.course?.title.toLowerCase().includes(search) ||
        s.room?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Get registered sections
  const registeredSections = enrollments
    .filter((e) => e.status === "ENROLLED")
    .map((e) => {
      const section = sections.find((s) => s.id === e.sectionId);
      return section ? { enrollment: e, section } : null;
    })
    .filter((item): item is { enrollment: Enrollment; section: Section } => item !== null)
    .filter((item) => !selectedTermId || String(item.section.termId) === selectedTermId);

  const toggleSectionSelection = (sectionId: number) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleRegister = async () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    setLoading(true);
    try {
      for (const sectionId of selectedSections) {
        await api.createEnrollment(currentUserId, sectionId);
      }
      toast.success(`Successfully enrolled in ${selectedSections.length} section(s)`);
      setSelectedSections([]);
      await loadData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to register for courses";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (enrollmentId: number) => {
    if (!confirm("Are you sure you want to drop this course?")) return;

    setLoading(true);
    try {
      await api.deleteEnrollment(enrollmentId);
      toast.success("Course dropped successfully");
      await loadData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to drop course";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const totalSelectedUnits = selectedSections.reduce((total, sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    return total + (section?.course?.credits || 0);
  }, 0);

  const totalRegisteredUnits = registeredSections.reduce(
    (total, item) => total + (item.section.course?.credits || 0),
    0,
  );

  const getSectionStatus = (section: Section) => {
    const enrolled = enrollments.filter(
      (e) => e.sectionId === section.id && e.status === "ENROLLED"
    ).length;
    const capacity = section.capacity || 0;
    
    if (capacity === 0) return { text: "Available", variant: "default" as const };
    if (enrolled >= capacity) return { text: "Full", variant: "destructive" as const };
    if (enrolled >= capacity * 0.9) return { text: "Almost Full", variant: "secondary" as const };
    return { text: "Available", variant: "default" as const };
  };

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

        {/* Term Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Academic Term</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTermId}
                onValueChange={setSelectedTermId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={String(term.id)}>
                      {term.name}
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
                      placeholder="Search courses by name, code, or room..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sections</CardTitle>
                <CardDescription>
                  {availableSections.length} sections available for registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : availableSections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedTermId ? "No sections available for this term" : "Please select a term"}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {availableSections.map((section) => {
                        const status = getSectionStatus(section);
                        const enrolled = enrollments.filter(
                          (e) => e.sectionId === section.id && e.status === "ENROLLED"
                        ).length;
                        const capacity = section.capacity || 0;
                        const isFull = capacity > 0 && enrolled >= capacity;

                        return (
                          <div
                            key={section.id}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={selectedSections.includes(section.id)}
                                onCheckedChange={() =>
                                  toggleSectionSelection(section.id)
                                }
                                disabled={isFull}
                              />
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {section.course?.code || "Unknown"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {section.course?.title || "Unknown Course"}
                                  </p>
                                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                    {section.room && <span>Room: {section.room}</span>}
                                    {section.term?.name && <span>• {section.term.name}</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">
                                {section.course?.credits || 0} Credits
                              </Badge>
                              {capacity > 0 && (
                                <Badge variant="outline">
                                  {enrolled}/{capacity}
                                </Badge>
                              )}
                              <Badge variant={status.variant}>
                                {status.text}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {selectedSections.length > 0 && (
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">
                            Selected Sections ({selectedSections.length})
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Total Credits: {totalSelectedUnits}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button className="gap-2" onClick={handleRegister} disabled={loading}>
                            <Plus className="w-4 h-4" />
                            Register Selected Sections
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedSections([])}
                          >
                            Clear Selection
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registered" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Courses</CardTitle>
                <CardDescription>
                  Courses you are currently registered for
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : registeredSections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No registered courses. Register for sections in the "Available Courses" tab.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {registeredSections.map(({ enrollment, section }) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {section.course?.code || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {section.course?.title || "Unknown Course"}
                              </p>
                              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                {section.room && <span>Room: {section.room}</span>}
                                {section.term?.name && <span>• {section.term.name}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">
                              {section.course?.credits || 0} Credits
                            </Badge>
                            <Badge variant="outline">
                              {section.term?.name || "Unknown Term"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDropCourse(enrollment.id)}
                              disabled={loading}
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
                          Total Registered Credits
                        </span>
                        <span className="text-lg font-bold text-green-800">
                          {totalRegisteredUnits} / 24
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
