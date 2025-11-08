import express from 'express';
import {Connection} from './src/config/dbconfig.js';
import { registerAdmin } from './src/controller/admin controller/adminRegistration.js';
import { loginAdmin } from './src/controller/admin controller/adminLogin.js';
import { registerStudent } from './src/controller/student controller/registerStudent.js';
import { getStudents } from './src/controller/student controller/getStudents.js';
import cors from 'cors'
import jwt from "jsonwebtoken";
import { deleteStudent } from './src/controller/student controller/deleteStudent.js';
import { updateStudent } from './src/controller/student controller/updateStudents.js';
import { sendOtp } from './src/controller/forgot password/sendOtp.js';
import { verifyOtp } from './src/controller/forgot password/verifyOtp.js';
import { resetPassword } from './src/controller/forgot password/resetPassword.js';


const app = express();


function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    const secretKey = process.env.JWT_SECRET || "vishal";
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}


// cors enablation
app.use(cors({
  origin: "http://127.0.0.1:5500",  // or "http://localhost:5500"
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(express.json())

//admin registration
app.post("/register-admin", registerAdmin)

//admin login
app.post("/admin-login", loginAdmin);

//student registration
app.post("/register-student/:admin_id", verifyToken, registerStudent);



//to get all student dacmta
app.get("/students", getStudents);

//to delete student
app.delete("/delete-student/:student_id", verifyToken, deleteStudent);


//to update students data
app.put("/update-student/:admin_id/:student_id", verifyToken, updateStudent);



//forget password
app.post("/forgot-password", sendOtp);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);


app.listen(5500, async () => {
    await Connection();
    console.log('Server is running on port 5500');
})
