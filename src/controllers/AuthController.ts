import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

const JWT_SECRET = "mysecretkey";
const REFRESH_TOKEN_SECRET = "myrefreshsecretkey";

const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET);
};

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("password", 10),
  },
];

const refreshTokens: string[] = [];

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ error: "Email ou senha inválidos" });
  }
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
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
