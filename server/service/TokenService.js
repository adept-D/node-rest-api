import jwt from 'jsonwebtoken';
import pool from "../../database/PostgresSQL/db.js";

class TokenService{
    create(payload) {
        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn : "30m"});
        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn : "30d"});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(accessToken){
        try {
            const userData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken){
        try {
            const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            return userData;
        } catch (e) {
            return null;

        }
    }

    async save(user_UUID, refreshToken){
        const tokenData = await pool.query(`
            select * from tokenservice where creator = '${user_UUID}';
        `);
        // console.log("tokenData: ",tokenData);
        if(tokenData.rows[0]){
            tokenData.rows[0].refreshToken = refreshToken;
            return tokenData.rows[0]; // tokenData.save();
        }

        const token = await pool.query(`
            insert into tokenservice(creator, refreshToken) values('${user_UUID}','${refreshToken}') ;
        `)
        // console.log("token: ",token);


        return token.rows[0];

    }

    async removeToken(refreshToken){
        const tokenData = await pool.query(`
             delete from tokenservice where refreshToken = '${refreshToken}';
        `)
        return tokenData.rows[0];
    }
    async findRefreshToken(refreshToken){
        const tokenData = await pool.query(`
            select * from tokenservice where refreshToken = '${refreshToken}';
        `)
        return tokenData.rows[0];
    }
   
}

export default new TokenService();