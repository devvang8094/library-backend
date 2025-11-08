import { connection } from "../../config/dbconfig.js";

export async function registerStudent(request, response){
    try{
        const admin_id  = request.params.admin_id;
        const {student_name, student_phone, student_email, plan_months,date_joining, plan_expiry} = request.body;
        const qry = `INSERT INTO students (student_name, student_phone, student_email, added_by, plan_months, date_joining, plan_expiry)
             VALUES ("${student_name}", "${student_phone}", "${student_email}", ${admin_id}, ${plan_months}, '${date_joining}', '${plan_expiry}')`;

        const [rows] = await connection.query(qry);

        if(rows.affectedRows === 1){
            const [admin] = await connection.query(`select * from admin where admin_id = ${admin_id}`)
            response.status(200).send({message:"Student added successfully by admin - "+admin[0].admin_name})
        }
        else{
            response.status(400).send({message:"Invalid data"});
        }
    }
    catch(error){
        response.status(500).send({message:"Internal server error->"+error})
    }
}

