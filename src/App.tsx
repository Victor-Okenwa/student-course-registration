import { useState, lazy, Suspense } from "react";

// dynamic (lazy) imports - map named exports to default where needed
const DashboardLayout = lazy(() =>
  import("./components/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
const DashboardOverview = lazy(() =>
  import("./components/DashboardOverview").then((m) => ({
    default: m.DashboardOverview,
  })),
);
const CourseRegistration = lazy(() =>
  import("./components/CourseRegistration").then((m) => ({
    default: m.CourseRegistration,
  })),
);
const ResultCalculator = lazy(() =>
  import("./components/ResultCalculator").then((m) => ({
    default: m.ResultCalculator,
  })),
);
const NotificationCenter = lazy(() =>
  import("./components/NotificationCenter").then((m) => ({
    default: m.NotificationCenter,
  })),
);
const SMSCenter = lazy(() =>
  import("./components/SMSCenter").then((m) => ({ default: m.SMSCenter })),
);
const LoginForm = lazy(() => import("./components/LoginForm"));
// ...existing code...

export type PageNames =
  | "login"
  | "dashboard"
  | "registration"
  | "results"
  | "notifications"
  | "messages";
export default function App() {
  const [activeSection, setActiveSection] = useState<PageNames>("login");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onSectionChange={setActiveSection} />;
      case "registration":
        return <CourseRegistration />;
      case "results":
        return <ResultCalculator />;
      case "notifications":
        return <NotificationCenter />;
      case "messages":
        return <SMSCenter />;
      default:
        return <DashboardOverview onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        {activeSection !== "login" ? (
          <DashboardLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          >
            {renderContent()}
          </DashboardLayout>
        ) : (
          <LoginForm onSectionChange={setActiveSection} />
        )}
      </Suspense>
    </div>
  );
}
