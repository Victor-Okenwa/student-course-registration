import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { DashboardOverviewProps } from "./DashboardOverview";

// Define the Zod schema for the login form
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Identifier is required" })
    .refine(
      (val) => {
        // Regex for student registration number: imt/unn/b.sc/cs/2021/016 format
        const regNumberRegex = /^imt\/unn\/b\.sc\/[a-z]+\/\d{4}\/\d{3}$/i; // Case-insensitive
        // Check if it's a valid email or matches the regex
        const isEmail = z.string().email().safeParse(val).success;
        const isRegNumber = regNumberRegex.test(val);
        return isEmail || isRegNumber;
      },
      {
        message:
          "Must be a valid email or student registration number (e.g., imt/unn/b.sc/cs/2021/001)",
      },
    ),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }), // Optional: Add min length for security
});

// Infer the form types from the schema
type LoginFormData = z.infer<typeof loginSchema>;

// Example usage in a React component
const LoginForm = ({ onSectionChange }: DashboardOverviewProps) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Form submitted:", data);
    onSectionChange("dashboard");
    // Handle login logic here
  };

  return (
    <div className="flex justify-center items-center h-screen relative overflow-hidden moving-grid bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:120px_120px] bg-repeat">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 z-20 min-w-sm max-w-sm bg-background shadow rounded-lg p-4 border-t-4 border-t-slate-600 border-l-4 border-l-slate-600"
        >
          <h2 className="text-slate-700 uppercase">
            Login to your students portal
          </h2>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email or reg number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>

      <div className="bg-primary/20 size-[250px] z-10 absolute bottom-[-65px] right-[-65px] rounded-full"></div>
    </div>
  );
};

export default LoginForm;
