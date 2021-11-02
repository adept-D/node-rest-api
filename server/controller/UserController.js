import pool from "../../database/PostgresSQL/db.js";
import TokenService from "../service/TokenService.js";
import UserService from "../service/UserService.js";

class UserController{
    async get(req, res, next){
        try {
            const authHeader = req.headers.authorization;
            const accessToken = authHeader.split(' ')[1];
            const userData = TokenService.validateAccessToken(accessToken); 

            const users = await UserService.get(userData);

            let tags = [];

            for(let i=0; i < users.rowCount; i++){
                tags[i] = {
                    id: users.rows[i].id,
                    name: users.rows[i].name,
                    sortOrder: users.rows[i].sortorder
                }
           
            }
            //! Проверить вывод id, мб надо по порядку
            res.status(200).json({
                email: users.rows[0].email,
                nickname: users.rows[0].nickname,
                tags: tags
            })
        } catch (e) {
            next(e);
        }
       
    }

    async update(req, res){
        try {
            const {email, password, nickname} = req.body;
            email, password, nickname = validateData(email, password, nickname);
    
            if(email != ''){
                pool.query(`
                    update usertable set email = ${email};
                `)
            }
            if(password != ''){
                pool.query(`
                    update usertable set password = ${password};
                `)
            }
            if(nickname != ''){
                pool.query(`
                    update usertable set nickname = ${nickname};
                `)
            }
    
           
    
            res.status(200).json({
                email, 
                password, 
                nickname
            })
            
        } catch (e) {
            next(e);

        }
       

    }

    async delete(req, res){
        try {
            const {email, password, nickname} = req.body;
            const deletedUser = pool.query(`
                delete from table where email = ${email} and password = ${password} and nickname = ${nickname} RETURNING *;
            `)
            res.status(200).json({
                deletedUser
            })
        } catch (e) {
            next(e);
        }
        
    }
}

export default new UserController();