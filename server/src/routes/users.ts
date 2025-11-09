import { Router } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.user.findMany({ orderBy: { id: "desc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body ?? {};
    if (!name || !email || !role) return res.status(400).json({ error: "name, email, role required" });
    let passwordHash: string | undefined = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(String(password), 10);
    }
    const created = await prisma.user.create({ data: { name: String(name), email: String(email).trim().toLowerCase(), role, passwordHash } });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role, password } = req.body ?? {};
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    if (!name || !email || !role) return res.status(400).json({ error: "name, email, role required" });
    let passwordHash: string | undefined = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(String(password), 10);
    }
    const updated = await prisma.user.update({
      where: { id },
      data: { name: String(name), email: String(email).trim().toLowerCase(), role, ...(passwordHash ? { passwordHash } : {}) },
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
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;


