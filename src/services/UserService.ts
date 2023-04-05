import pool from "../db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const UserService = {
  async getAllUsers(): Promise<User[]> {
    const [rows]: any = await pool.query(`SELECT * FROM users`);
    return rows;
  },

  async VerifyEmailExist(user: User): Promise<Boolean> {
    const [existingUser]: any = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [user.email]
    );

    if (existingUser.length > 0) {
      return true;
    }

    return false;
  },

  async createUser(user: User): Promise<User> {
    const [result]: any = await pool.query(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [user.name, user.email, bcrypt.hashSync(user.password, 10)]
    );
    return { id: result?.insertId, ...user };
  },

  async getUserById(id: number): Promise<User | null> {
    const [rows]: any = await pool.query(`SELECT * FROM users WHERE id = ?`, [
      id,
    ]);
    if (rows?.length === 0) {
      return null;
    }
    return rows[0];
  },

  async updateUser(user: User): Promise<User | null> {
    const [result]: any = await pool.query(
      `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
      [user.name, user.email, bcrypt.hashSync(user.password, 10), user.id]
    );
    if (result?.affectedRows === 0) {
      return null;
    }
    return user;
  },

  async deleteUser(id: number): Promise<boolean> {
    const [result]: any = await pool.query(`DELETE FROM users WHERE id = ?`, [
      id,
    ]);
    return result?.affectedRows > 0;
  },
};
