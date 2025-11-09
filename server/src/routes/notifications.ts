import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Get notifications for current user
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).user.id as number;
    const items = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Mark a notification as read
router.post("/:id/read", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.id as number;
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    if (updated.userId !== userId) return res.status(403).json({ error: "Forbidden" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Admin: create a notification for a specific user
router.post("/user/:userId", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { title, message, category, type, priority } = req.body ?? {};
    if (!title || !message) return res.status(400).json({ error: "title and message required" });
    const created = await prisma.notification.create({
      data: { userId, title: String(title), message: String(message), category, type, priority },
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// Admin: broadcast to all students
router.post("/broadcast/students", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { title, message, category, type, priority } = req.body ?? {};
    if (!title || !message) return res.status(400).json({ error: "title and message required" });
    const students = await prisma.user.findMany({ where: { role: "STUDENT" }, select: { id: true } });
    const created = await prisma.$transaction(
      students.map((s) =>
        prisma.notification.create({
          data: { userId: s.id, title: String(title), message: String(message), category, type, priority },
        }),
      ),
    );
    res.status(201).json({ count: created.length });
  } catch (e) {
    next(e);
  }
});

export default router;
