import { connection } from "../../config/dbconfig.js";


export async function deleteStudent(request, response){
    try{
        const student_id = request.params.student_id;
        const qry = `delete from students where student_id=${student_id}`;
        const [rows] = await connection.query(qry);
        if(rows.affectedRows === 0){
            response.status(404).send({message:"Student not found in database"});
        }
        else{
            response.status(200).send({message:"Student deleted Successfully"});
        }
    }
    catch(error){
        response.status(500).send({message:"Internal server error"+error})
    }
}