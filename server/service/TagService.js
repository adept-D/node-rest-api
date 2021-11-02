import pool from "../../database/PostgresSQL/db.js";
import ApiError from "../exceptions/ApiError.js";


class TagService{
    async create(name, sortOrder, userData){
        const isDuplicatedName = await pool.query(`
            select * from Tag where name = '${name}' and creator = '${userData.uuid}';
        `)
         console.log(isDuplicatedName);
        if(isDuplicatedName.rows[0]){
            throw ApiError.BadRequest("Такое название уже имеется");
        }


        const tag = await pool.query(`

            insert into Tag(creator, name, sortOrder) values('${userData.uuid}', '${name}','${sortOrder}') RETURNING *;
        `)
        //? Strange code
        if(sortOrder != 0){
            await pool.query(`
                select * from Tag order by sortOrder;
            `)
        }

        return tag;
    }   

}

export default new TagService();