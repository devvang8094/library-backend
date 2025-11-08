
import { connection } from "../../config/dbconfig.js";

export async function updateStudent(request, response){
    try{
        const added_by = request.params.admin_id;
        const student_id = request.params.student_id;
        const {student_name, student_phone, plan_months, plan_expiry, date_joining} = request.body;

         const qry = `update students set student_name = "${student_name}", student_phone="${student_phone}", added_by=${added_by}, plan_months=${plan_months}, plan_expiry='${plan_expiry}', date_joining='${date_joining}' where student_id=${student_id}`;

         const [rows] = await connection.query(qry);

         if(rows.affectedRows === 0){
            response.status(400).send({message:"Student data not updated"});
         }
         else{
            response.status(200).send({message:"Student data updated successfully!"})
         }
    }
    catch(error){
        response.status(500).send({message:"Internal server error->"+error})
    }
}