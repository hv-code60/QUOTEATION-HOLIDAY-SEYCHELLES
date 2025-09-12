
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET;
export function signToken(payload) { return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); }
export function verifyToken(token) { try { return jwt.verify(token, JWT_SECRET); } catch { return null; } }
export function getUserFromCookie() { const token = cookies().get("token")?.value; return token ? verifyToken(token) : null; }
