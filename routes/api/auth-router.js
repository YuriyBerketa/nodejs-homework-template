import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from '../../decorators/index.js';

import usersSchemas from "../../schemas/users-schemas.js";

import { authenticate, upload } from '../../middlewars/index.js';

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), validateBody(usersSchemas.userRegisterSchema), authController.register)

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post("/verify", validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail);

authRouter.post("/login", validateBody(usersSchemas.userLoginSchema), authController.login)

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;