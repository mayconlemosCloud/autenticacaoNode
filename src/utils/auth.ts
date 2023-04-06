import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
let refreshTokens: string[] = [];

export const generateAccessToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "5m" }
  );
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET);
};

export const addRefreshToken = (refreshToken: string) => {
  refreshTokens.push(refreshToken);
  fs.writeFileSync(
    path.join(__dirname, "../refreshTokens.json"),
    JSON.stringify(refreshTokens)
  );
};

const refreshTokensFile = path.join(__dirname, "../refreshTokens.json");

if (fs.existsSync(refreshTokensFile)) {
  // Se o arquivo de tokens de atualização existir, carregue os tokens existentes
  refreshTokens = JSON.parse(
    fs.readFileSync(refreshTokensFile, { encoding: "utf-8" })
  );
}

export const loadRefreshTokens = (): string[] => {
  return refreshTokens;
};
