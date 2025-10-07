import { useState } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./components/DashboardOverview";
import { CourseRegistration } from "./components/CourseRegistration";
import { ResultCalculator } from "./components/ResultCalculator";
import { NotificationCenter } from "./components/NotificationCenter";
import { SMSCenter } from "./components/SMSCenter";
import LoginForm from "./components/LoginForm";

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
    </div>
  );
}
