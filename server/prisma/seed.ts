import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const termFall = await prisma.term.upsert({
    where: { name: "2025 Fall" },
    update: {},
    create: { name: "2025 Fall" },
  });

  const cs1 = await prisma.course.upsert({
    where: { code: "CSC 301" },
    update: {},
    create: { code: "CSC 301", title: "Database Systems", credits: 3 },
  });
  const cs2 = await prisma.course.upsert({
    where: { code: "CSC 305" },
    update: {},
    create: { code: "CSC 305", title: "Software Engineering", credits: 3 },
  });

  // Create sections (using individual creates for SQLite compatibility)
  try {
    await prisma.section.create({
      data: { courseId: cs1.id, termId: termFall.id, room: "B101", capacity: 60 },
    });
  } catch (e) {
    // Section already exists, skip
  }
  
  try {
    await prisma.section.create({
      data: { courseId: cs2.id, termId: termFall.id, room: "B102", capacity: 50 },
    });
  } catch (e) {
    // Section already exists, skip
  }

  const studentPass = await bcrypt.hash("password123", 10);
  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: { name: "Sample Student", email: "student@example.com", role: "STUDENT", passwordHash: studentPass },
  });
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Admin User", email: "admin@example.com", role: "ADMIN", passwordHash: adminPass },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


