import pool from "../../database/PostgresSQL/db.js";
import TagService from "../service/TagService.js";
import TokenService from "../service/TokenService.js";

class TagController{
    async create(req, res){
        const {name, sortOrder} = req.body;
        if(name.length > 40){
            res.status(400).json({message: "name length greater 40 symbols"});
            return;
        }
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];
        const userData = TokenService.validateAccessToken(accessToken); 
        
        const tagData = await TagService.create(name,sortOrder,userData);
      
        // console.log(tagData);

        res.status(200).json({
            id: tagData.rows[0].id,
            name: tagData.rows[0].name,
            sortOrder: tagData.rows[0].sortorder
        })  
    }

    async getOne(req, res){

    }

    async updateOne(req, res){

    }

    async deleteOne(req, res){

    }
}

export default new TagController();