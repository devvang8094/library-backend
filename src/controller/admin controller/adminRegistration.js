import { hashSync } from "bcrypt";
import {connection} from "../../config/dbconfig.js"

export async function registerAdmin(request, response) {
    try{
        const {admin_name, admin_phone, admin_email, admin_pass}  = request.body;
        let pass = hashSync(admin_pass,10);
        let qry  = `insert into admin (admin_name, admin_phone, admin_email, admin_pass) 
        values("${admin_name}", "${admin_phone}", "${admin_email}", "${pass}")`;

        const [rows] = await connection.query(qry);

        if(rows.affectedRows === 1){
            response.status(200).send({message:"Admin registered successfully!"});
        }
        else{
            response.status(400).send({message:"Invalid admin data"});
        }
    }
    catch(error){
        console.log("Request body:", request.body);

        response.status(500).send({message:"internal server error ->"+error});
    }
}