import { Router } from "express";
import * as UserController from "../controllers/UserController";
import * as AuthController from "../controllers/AuthController";

const router = Router();

router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

router.post("/auth/login", AuthController.login);
router.post("/auth/refresh", AuthController.refresh);
router.post("/auth/validate", AuthController.validateAccessToken);

export default router;
