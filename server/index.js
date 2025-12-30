import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import passport from "passport"  // ADD THIS
import "./db.js"
import authRoutes from "./routes/auth.js";
import stickyRoutes from "./routes/stickies.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(passport.initialize())  // ADD THIS

app.use("/api/auth", authRoutes);
app.use("/api/stickies", stickyRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
