import { compareSync } from "bcrypt";
import { connection } from "../../config/dbconfig.js";
import  jwt  from "jsonwebtoken";


export async function loginAdmin(request,response){
    try{
        const {admin_phone, admin_pass} = request.body;
        const [rows] = await connection.query(`select * from admin where admin_phone="${admin_phone}"`);

        if(rows.length === 0){
            response.status(400).send({message:"Invalid phone number !"});
        }
        else{
            const user = rows[0];
            const hashpass = user.admin_pass;
            const loginpass = admin_pass;
            console.log(compareSync(loginpass,hashpass))
            if(compareSync(loginpass,hashpass)){
                const token = jwt.sign({admin_phone:admin_phone, role:"admin",admin_id:user.admin_id}, "vishal");
                response.status(200).send({message:"Login successfully your token is -",
                    token:token,
                    admin_id:user.admin_id})
            }
            else{
                response.status(400).send({message:"Invalid password, please enter correct password!"})
            }
        }
    }
    catch(error){
        response.status(500).send({message:"internal server error"+error});
    }
}