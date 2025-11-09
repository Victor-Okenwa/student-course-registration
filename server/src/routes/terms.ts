import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.term.findMany({ orderBy: { id: "desc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "name required" });
    const term = await prisma.term.create({ data: { name } });
    res.status(201).json(term);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "name required" });
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    const term = await prisma.term.update({
      where: { id },
      data: { name },
    });
    res.json(term);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    await prisma.term.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;


