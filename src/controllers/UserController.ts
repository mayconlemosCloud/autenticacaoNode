import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { User } from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await UserService.getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const newUser: User = req.body;
  const isVerifyEmailExist = await UserService.VerifyEmailExist(newUser);
  if (isVerifyEmailExist) {
    res.status(409).json("Email já cadastrado");
  } else {
    const user = await UserService.createUser(newUser);
    res.status(201).json(user);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedUser: User = req.body;
  updatedUser.id = id;
  const user = await UserService.updateUser(updatedUser);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = await UserService.deleteUser(id);
  if (deleted) {
    res.json({ message: "Usuário removido com sucesso" });
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};
