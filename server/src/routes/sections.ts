import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.section.findMany({ include: { course: true, term: true }, orderBy: { id: "desc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { courseId, termId, room, capacity, instructorId } = req.body ?? {};
    if (!courseId || !termId) return res.status(400).json({ error: "courseId and termId required" });
    const created = await prisma.section.create({
      data: {
        courseId: Number(courseId),
        termId: Number(termId),
        room: room ? String(room) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        instructorId: instructorId ? Number(instructorId) : undefined,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { courseId, termId, room, capacity, instructorId } = req.body ?? {};
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    if (!courseId || !termId) return res.status(400).json({ error: "courseId and termId required" });
    const updated = await prisma.section.update({
      where: { id },
      data: {
        courseId: Number(courseId),
        termId: Number(termId),
        room: room ? String(room) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        instructorId: instructorId ? Number(instructorId) : undefined,
      },
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    await prisma.section.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;


