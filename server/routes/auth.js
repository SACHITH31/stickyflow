import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// GitHub Passport Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
        
        let user = await new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM users WHERE github_id = ? OR email = ?",
            [profile.id, email],
            (err, results) => (err ? reject(err) : resolve(results[0]))
          );
        });

        if (!user) {
          user = await new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO users (name, email, github_id, provider) VALUES (?, ?, ?, 'github')",
              [profile.username, email, profile.id],  // ✅ profile.username = GitHub username!
              (err, result) => (err ? reject(err) : resolve({ id: result.insertId, name: profile.username }))
            );
          });
        }

        done(null, { id: user.id, name: user.name || profile.username }); // ✅ Ensure name exists
      } catch (err) {
        done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    done(err, results[0]);
  });
});

// MANUAL REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, 'local')",
    [name, email, hashed],
    (err, result) => {
      if (err) return res.status(400).json({ error: "User exists" });
      const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token });
    }
  );
});

// MANUAL LOGIN - ADD USER INFO
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
    if (err || data.length === 0) return res.status(400).json({ error: "User not found" });

    const user = data[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  });
});


// MANUAL LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
    if (err || data.length === 0) return res.status(400).json({ error: "User not found" });

    const user = data[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// GitHub OAuth Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
     console.log("GitHub req.user:", req.user);
    const token = jwt.sign({ 
      id: req.user.id,
      name: req.user.name,
      // email: req.user.email 
    }, 
    process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// OAuth Success (Frontend reads token from URL)
router.get("/success", (req, res) => {
  const token = req.query.token;
  res.json({ token });
});

export default router;

// the end