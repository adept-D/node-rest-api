import pool from "../../database/PostgresSQL/db.js";


class UserService{
    async get(userData){
        const userAndTag = await pool.query(`
            select  usertable.email, usertable.nickname, tag.* from usertable inner join tag on usertable.uuid = tag.creator where usertable.uuid = '${userData.uuid}';  
        `)

        return userAndTag;
    }
}

export default new UserService();