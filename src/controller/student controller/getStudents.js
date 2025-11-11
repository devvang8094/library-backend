// import { connection } from "../../config/dbconfig.js";

// export async function getStudents(request,response){
//     try{
//         const qry = `select * from students`;
//         const[rows] = await connection.query(qry);
//         if(rows.length === 0){
//             response.status(400).send({message:"No available students"});
//         }
//         else{
//             response.status(200).send({message:"student data ->", data:rows});
//         }
//     }
//     catch(error){
//         response.status(500).send({message:"Internal server error-->"+error});
//     }
// }

import { connection } from "../../config/dbconfig.js";

export async function getStudents(request, response) {
  try {
    const qry = `
      SELECT
        student_id,
        student_name,
        student_phone,
        student_email,
        added_by,
        plan_months,
        plan_expiry,
        date_joining,
        active_days,
        -- total_active_days = stored active_days + elapsed days in current cycle (only up to today, never future)
        CASE
          WHEN date_joining IS NULL THEN active_days
          ELSE active_days
               + GREATEST(
                   DATEDIFF(
                     LEAST(COALESCE(plan_expiry, CURDATE()), CURDATE()),
                     date_joining
                   ) + 1,
                   0
                 )
        END AS total_active_days
      FROM students;
    `;

    const [rows] = await connection.query(qry);

    if (!rows || rows.length === 0) {
      response.status(200).send({ message: "No available students", data: [] });
    } else {
      response.status(200).send({ message: "student data ->", data: rows });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    response.status(500).send({ message: "Internal server error --> " + error });
  }
}
