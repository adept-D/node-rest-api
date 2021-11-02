import { Router } from "express";
import LoginController from "../controller/LoginController.js";
import TagByUserController from "../controller/TagByUserController.js";
import TagController from "../controller/TagController.js";
import UserController from "../controller/UserController.js";
import {body} from 'express-validator';
import authMiddleware from "../middlewares/authMiddleware.js";
const router = new Router();

// пользователь заходит если зарегистрирован
router.post("/signin",  
    body('email').isEmail(),
    body('password')
        .isLength({min:8, max:32})
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),

    LoginController.signin); 
router.post("/login", LoginController.login); // регистрировать пользователя
router.post("/logout", LoginController.logout); // пользователь выходит, если захочет зайти => login

router.get('/refresh',LoginController.refresh);
//! Закрыто под авторизацией нижестоящие роуты

router.get("/user", authMiddleware, UserController.get);
router.put("/user", authMiddleware, UserController.update);
router.delete("/user", authMiddleware , UserController.delete);

router.post("/tag", authMiddleware, TagController.create);
router.get("/tag/:id", authMiddleware, TagController.getOne);
router.put("/tag/:id", authMiddleware, TagController.updateOne);
router.delete("/tag/:id", authMiddleware, TagController.deleteOne);

router.post("/user/tag", authMiddleware, TagByUserController.checkAndAddTag);
router.delete("/user/tag/:id", authMiddleware, TagByUserController.deleteOne);
router.get("/user/tag/my", authMiddleware, TagByUserController.getAll);


export default router;