import pool from "../../database/PostgresSQL/db.js";
import ApiError from "../exceptions/ApiError.js";
import bcrypt from 'bcrypt'
import UserDTO from "../dto/UserDTO.js";
import TokenService from "./TokenService.js";


class LoginService{
    async signin(email, password, nickname){
        
        // получение всех данных с таблицы UserTable у которых email соответвствует
        const candidate = await pool.query(`    
            select * from UserTable where email = '${email}';
        `)
        
        if(candidate.rows[0]){
            throw ApiError.BadRequest("Пользователь с таким email существует");
        }

        const hashPassword = await bcrypt.hash(password,3); //process.env.SALT_OF_PASSWORD
        // добавление данных в таблицу UserTable
        const user = await pool.query(` 
            insert into UserTable(email, password, nickname) 
            values ('${email}', '${hashPassword}', '${nickname}') RETURNING * ; 
        `);

        const userDTO = new UserDTO(user.rows[0]); 
        const tokens = TokenService.create({...userDTO});
        await TokenService.save(userDTO.uuid, tokens.refreshToken);


        return {
            ...tokens,
            userDTO
        }
    }

    async login(email, password){
        const user = await pool.query(`
            select * from usertable where email = '${email}';
        `)
        if(!user){
            throw ApiError.BadRequest("Пользователь с таким email не найден");
        }
        console.log(user)
        const isPasswordEqual = await bcrypt.compare(password, user.rows[0].password); 
        if(!isPasswordEqual){
            throw ApiError.BadRequest("Неверный пароль");
        }

        const userDTO = new UserDTO(user.rows[0]);
        const tokens = TokenService.create({...userDTO})

        await TokenService.save(userDTO.uuid, tokens.refreshToken);
            
        return {
            ...tokens,
            userDTO
        }
    }

    async logout(refreshToken){
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnAuthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findRefreshToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnAuthorizedError();
        }
        const user =  await pool.query(`
            select * from usertable where uuid = '${userData.uuid}';
        `)
        const userDTO = new UserDTO(user.rows[0]);
        const tokens = TokenService.create({...userDTO})

        await TokenService.save(userDTO.uuid, tokens.refreshToken);
            
        return {
            ...tokens,
            userDTO
        }
    }
}

export default new LoginService();