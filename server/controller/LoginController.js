import pool from "../../database/PostgresSQL/db.js";
import bcrypt from 'bcrypt'
import TokenService from "../service/TokenService.js";
import UserDTO from "../dto/UserDTO.js";
import {validationResult} from 'express-validator';
import ApiError from "../exceptions/ApiError.js";
import LoginService from "../service/LoginService.js";
import jwt from 'jsonwebtoken';


class LoginController{
    async signin(req, res, next){ // Регистрация
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                next(ApiError.BadRequest("Ошибка валидации", errors.array()))
            }

            const {email, password, nickname} = req.body;
            const userData = await LoginService.signin(email, password, nickname);

            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true}); //? Strange behavirious 
            res.status(200).json({
                ...userData
            })

        } catch (e) {
            next(e);
        }
        
    }

    async login(req, res, next){
        try {   
            const {email, password} = req.body;
            const userData = await LoginService.login(email,password);

            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true});
            res.status(200).json({
                token: userData.accessToken,
                expire: jwt.decode(userData.accessToken).exp,
            })
           
            
        } catch (e) {
            next(e);
        } 
    }
    

    async logout(req, res, next){
       try {
           const {refreshToken} = req.cookies;
           const token = await LoginService.logout(refreshToken);
           res.clearCookie('refreshToken');
           return res.status(200).json({...token})
       } catch (e) {
           next(e);
       }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await LoginService.refresh(refreshToken);
            userData.userDTO.uuid

            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true}); //? Strange behavirious 
            res.status(200).json({
                ...userData
            })
        } catch (e) {
            next(e);
        }
    }
}

export default new LoginController();