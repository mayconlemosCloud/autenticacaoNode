import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserService } from "../services/UserService";
import {
  addRefreshToken,
  loadRefreshTokens,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: User;
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = await UserService.getAllUsers();
  const user = users.find((user) => user.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    addRefreshToken(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ error: "Email ou senha inválidos" });
  }
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const isToken = loadRefreshTokens().includes(refreshToken);
  if (!refreshToken || !isToken) {
    res.status(401).json({ error: "Refresh token inválido" });
  } else {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
      if (err) {
        res.status(403).json({ error: "Token expirado" });
      } else {
        const accessToken = generateAccessToken({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        res.json({ accessToken });
      }
    });
  }
};

export const validateAccessToken = (req: AuthRequest, res: Response) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ error: "Token de acesso não encontrado" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = decoded;
    return res.status(200).json({ message: "Token de acesso válido" });
  } catch (error) {
    return res.status(401).json({ error: "Token de acesso inválido" });
  }
};
