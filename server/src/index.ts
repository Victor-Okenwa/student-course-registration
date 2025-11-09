import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.js";
import termsRouter from "./routes/terms.js";
import coursesRouter from "./routes/courses.js";
import sectionsRouter from "./routes/sections.js";
import usersRouter from "./routes/users.js";
import enrollmentsRouter from "./routes/enrollments.js";
import authRouter from "./routes/auth.js";
import notificationsRouter from "./routes/notifications.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"], credentials: false }));
app.use(express.json());

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

app.use("/api/admin", adminRouter);
app.use("/api/terms", termsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/sections", sectionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


