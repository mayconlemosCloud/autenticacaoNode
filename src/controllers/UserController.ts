import { Request, Response } from "express";
import { User } from "../models/User";

let users: User[] = [];

export const getUsers = (req: Request, res: Response) => {
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};

export const createUser = (req: Request, res: Response) => {
  const newUser: User = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    const updatedUser: User = req.body;
    updatedUser.id = id;
    users[index] = updatedUser;
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ message: "Usuário removido com sucesso" });
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
};
