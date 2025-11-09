import { Router } from "express";
import { prisma } from "../prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { AuthPayload } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

router.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body ?? {};
    if (!identifier || !password)
      return res.status(400).json({ error: "identifier and password required" });

    // For now, identifier is email
    const email = String(identifier).trim().toLowerCase();
    const pass = String(password);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash)
      return res.status(401).json({ error: "Invalid credentials or user not found", user: user, pass: pass });

    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials or password missmatch", user: user, pass: pass, hash: user.passwordHash });

    const payload: AuthPayload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user });
  } catch (e) {
    next(e);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const id = (req as any).user.id as number;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
