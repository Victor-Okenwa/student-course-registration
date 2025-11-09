# Simple Setup Guide - Student Course Registration

## ✅ What's Been Fixed

1. ✅ Fixed import paths in server
2. ✅ Changed database from PostgreSQL to SQLite (no separate DB server needed!)
3. ✅ Fixed Prisma schema (removed enums, using strings for SQLite compatibility)
4. ✅ Updated seed script to work with SQLite
5. ✅ Fixed ES module issues (using tsx instead of ts-node-dev)

## Step 1: Install Dependencies

### Frontend (Root Directory)
Open a terminal in the project root:
```bash
npm install
```

### Backend (Server Directory)
```bash
cd server
npm install
```

## Step 2: Set Up Database

The database uses SQLite (no separate database server needed!)

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate Prisma client
- Create the database file (`server/prisma/dev.db`)
- Set up all tables

## Step 3: Seed Database (Add Sample Data)

```bash
cd server
npm run seed
```

This creates:
- Sample terms (2025 Fall)
- Sample courses (CSC 301, CSC 305)
- Sample sections
- Sample users (student@example.com, admin@example.com)

## Step 4: Start the Server

In the `server` directory:
```bash
cd server
npm run dev
```

The server will run on `http://localhost:4000`
You should see: `Server listening on http://localhost:4000`

## Step 5: Start the Frontend

Open a NEW terminal in the root directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## That's it! 🎉

Both servers should now be running:
- ✅ Frontend: http://localhost:5173
- ✅ Backend: http://localhost:4000

Test the backend: Visit http://localhost:4000/api/health (should return `{"status":"ok"}`)

## Quick Test Commands

Test if server is running (PowerShell):
```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/health
```

Or just visit in your browser:
- http://localhost:4000/api/health

## Troubleshooting

1. **Port already in use**: Make sure ports 4000 and 5173 are not already in use
2. **Database errors**: Make sure you ran `prisma:generate` and `prisma:migrate` in the server directory
3. **Module errors**: Make sure all dependencies are installed (`npm install` in both root and server directories)
4. **Server won't start**: Check that you're in the `server` directory when running `npm run dev`
5. **Import errors**: Make sure you've run `npm install` in the server directory to get the `tsx` package

## Database Location

The SQLite database file is located at: `server/prisma/dev.db`

You can view/edit the database using Prisma Studio:
```bash
cd server
npm run prisma:studio
```
