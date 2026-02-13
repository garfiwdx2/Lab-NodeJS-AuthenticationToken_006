import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  const { username, password, name, role } = req.body;

  // 1️⃣ ตรวจสอบข้อมูลพื้นฐาน
  if (!username || !password) {
    return res.status(400).json({
      message: "username & password required",
    });
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "username & password must be string",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "password must be at least 6 characters",
    });
  }

  try {
    // 2️⃣ ตรวจสอบ username ซ้ำ
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE user_name = $1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "username already exists",
      });
    }

    // 3️⃣ hash password
    const hash = await bcrypt.hash(password, 10);

    // 4️⃣ insert user
    const { rows } = await pool.query(
      `INSERT INTO users (user_name, password, name, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, user_name, name, role`,
      [username, hash, name || null, role || "user"]
    );

    // 5️⃣ response
    res.status(201).json({
      message: "User registered",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({
      message: "username & password required",
    });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_name = $1 LIMIT 1",
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 สร้าง JWT
    const accessToken = jwt.sign(
      {
        userid: user.id,
        username: user.user_name,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    // ✅ ส่งข้อมูลให้ตรงสไลด์
    res.json({
      user: {
        userid: user.id,
        username: user.user_name,
        role: user.role,
      },
      token: accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  
};

/* ================= REFRESH ================= */
export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userid: user.userid, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};
