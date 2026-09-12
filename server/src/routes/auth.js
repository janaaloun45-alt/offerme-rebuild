import bcrypt from "bcryptjs";
import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

export const authRouter = Router();

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

async function signupHandler(req, res) {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password || String(password).length < 8) {
    return res.status(400).json({ error: "Name, email and a password of at least 8 characters are required." });
  }
  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });
  const passwordHash = await bcrypt.hash(String(password), 12);
  const user = await User.create({ name, email: String(email).toLowerCase(), passwordHash, selectedCards: [] });
  return res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
}

authRouter.post("/register", signupHandler);
authRouter.post("/signup", signupHandler);

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid email or password." });
  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password." });
  return res.json({ token: signToken(user._id), user: publicUser(user) });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ user: publicUser(user) });
});
