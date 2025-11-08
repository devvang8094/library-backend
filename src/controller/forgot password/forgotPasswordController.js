import { connection } from "../config/dbconfig.js";
import nodemailer from "nodemailer";

// Helper function to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Create mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "your-app-password", // Use Gmail app password
  },
});

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Check if email exists
    const [rows] = await connection.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await connection.query(
      `UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?`,
      [otp, expiry, email]
    );

    // Send mail
    const mailOptions = {
      from: '"Library Admin" <youremail@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Forgot Password - OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>It will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}
