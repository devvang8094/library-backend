import { connection } from "../../config/dbconfig.js";
import nodemailer from "nodemailer";

// Function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devang8094@gmail.com", // replace
    pass: "ziiv iwsl sdpq trip",   // use Gmail app password
  },
});

export async function sendOtp(req, res) {
  try {
    const { admin_phone } = req.body;

    const [rows] = await connection.query(
      "SELECT * FROM admin WHERE admin_phone = ?",
      [admin_phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found!" });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    await connection.query(
      "UPDATE admin SET otp = ?, otp_expiry = ? WHERE admin_phone = ?",
      [otp, expiry, admin_phone]
    );

    const mailOptions = {
      from: '"Library " <devang8094@gmail.com>',
      to: rows[0].admin_email, // assuming you have this column
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent successfully to your registered email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Server error while sending OTP." });
  }
}
