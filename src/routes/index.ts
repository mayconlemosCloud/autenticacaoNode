import { Router } from "express";
import * as UserController from "../controllers/UserController";

const router = Router();

router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
