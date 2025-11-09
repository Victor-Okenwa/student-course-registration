import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.course.findMany({ orderBy: { id: "desc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { code, title, credits } = req.body ?? {};
    if (!code || !title || Number.isNaN(Number(credits))) {
      return res.status(400).json({ error: "code, title, credits required" });
    }
    const course = await prisma.course.create({
      data: { code: String(code), title: String(title), credits: Number(credits) },
    });
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { code, title, credits } = req.body ?? {};
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    if (!code || !title || Number.isNaN(Number(credits))) {
      return res.status(400).json({ error: "code, title, credits required" });
    }
    const course = await prisma.course.update({
      where: { id },
      data: { code: String(code), title: String(title), credits: Number(credits) },
    });
    res.json(course);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    await prisma.course.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;


