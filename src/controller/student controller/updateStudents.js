
// import { connection } from "../../config/dbconfig.js";

// export async function updateStudent(request, response){
//     try{
//         const added_by = request.params.admin_id;
//         const student_id = request.params.student_id;
//         const {student_name, student_phone, plan_months, plan_expiry, date_joining} = request.body;

//          const qry = `update students set student_name = "${student_name}", student_phone="${student_phone}", added_by=${added_by}, plan_months=${plan_months}, plan_expiry='${plan_expiry}', date_joining='${date_joining}' where student_id=${student_id}`;

//          const [rows] = await connection.query(qry);

//          if(rows.affectedRows === 0){
//             response.status(400).send({message:"Student data not updated"});
//          }
//          else{
//             response.status(200).send({message:"Student data updated successfully!"})
//          }
//     }
//     catch(error){
//         response.status(500).send({message:"Internal server error->"+error})
//     }
// }


import { connection } from "../../config/dbconfig.js";

export async function updateStudent(request, response) {
  try {
    const added_by = request.params.admin_id;
    const student_id = request.params.student_id;
    const { student_name, student_phone, plan_months, plan_expiry, date_joining } = request.body;

    // ✅ 1. Validate required fields
    if (!student_name || !student_phone || !plan_expiry || !date_joining) {
      return response.status(400).send({ message: "Missing required fields" });
    }

    // ✅ 2. Calculate total active days
    const joinDate = new Date(date_joining);
    const expiryDate = new Date(plan_expiry);

    // Calculate the difference in days (expiry - join)
    const diffTime = expiryDate - joinDate;
    let active_days = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // convert ms → days

    // Optional: if you want to include both start and end date
    // active_days = active_days + 1;

    if (active_days < 0) active_days = 0; // handle invalid cases

    // ✅ 3. Update student details with active_days
    const qry = `
      UPDATE students 
      SET 
        student_name = ?,
        student_phone = ?,
        added_by = ?,
        plan_months = ?,
        plan_expiry = ?,
        date_joining = ?,
        active_days = ?
      WHERE student_id = ?
    `;

    const [rows] = await connection.query(qry, [
      student_name,
      student_phone,
      added_by,
      plan_months,
      plan_expiry,
      date_joining,
      active_days,
      student_id,
    ]);

    // ✅ 4. Check if updated successfully
    if (rows.affectedRows === 0) {
      response.status(400).send({ message: "Student data not updated" });
    } else {
      response.status(200).send({
        message: "Student data updated successfully!",
        active_days,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send({ message: "Internal server error -> " + error });
  }
}
