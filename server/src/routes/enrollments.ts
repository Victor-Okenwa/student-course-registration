import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// Get all enrollments
router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.enrollment.findMany({
      include: {
        user: true,
        section: {
          include: {
            course: true,
            term: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Get enrollments for a specific user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "invalid userId" });
    const items = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        section: {
          include: {
            course: true,
            term: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Create enrollment
router.post("/", async (req, res, next) => {
  try {
    const { userId, sectionId } = req.body ?? {};
    if (!userId || !sectionId) {
      return res.status(400).json({ error: "userId and sectionId required" });
    }
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: Number(userId),
        sectionId: Number(sectionId),
        status: "ENROLLED",
      },
      include: {
        user: true,
        section: {
          include: {
            course: true,
            term: true,
          },
        },
      },
    });
    res.status(201).json(enrollment);
  } catch (e) {
    next(e);
  }
});

// Update enrollment status
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body ?? {};
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    if (!status) return res.status(400).json({ error: "status required" });
    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        section: {
          include: {
            course: true,
            term: true,
          },
        },
      },
    });
    res.json(enrollment);
  } catch (e) {
    next(e);
  }
});

// Delete enrollment (drop course)
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    await prisma.enrollment.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;

