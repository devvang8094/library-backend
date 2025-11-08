import { connection } from "../../config/dbconfig.js";

export async function getStudents(request,response){
    try{
        const qry = `select * from students`;
        const[rows] = await connection.query(qry);
        if(rows.length === 0){
            response.status(400).send({message:"No available students"});
        }
        else{
            response.status(200).send({message:"student data ->", data:rows});
        }
    }
    catch(error){
        response.status(500).send({message:"Internal server error-->"+error});
    }
}