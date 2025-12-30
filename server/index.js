import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";

import "./db.js";
import authRoutes from "./routes/auth.js";
import stickyRoutes from "./routes/stickies.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/stickies", stickyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
