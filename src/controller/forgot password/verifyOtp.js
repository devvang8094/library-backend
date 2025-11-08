import { connection } from "../../config/dbconfig.js";

export async function verifyOtp(req, res) {
  try {
    const { admin_phone, otp } = req.body;
    // console.log(otp)
    const [rows] = await connection.query(
      "SELECT otp, otp_expiry FROM admin WHERE admin_phone = ?",
      [admin_phone]
    );
    // console.log(rows)
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found!" });
    }

    const admin = rows[0];
    const now = new Date();

    if (!admin.otp || now > new Date(admin.otp_expiry)) {
      return res.status(400).json({ success: false, message: "OTP expired!" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // Clear OTP after verification
    await connection.query(
      "UPDATE admin SET otp = NULL, otp_expiry = NULL WHERE admin_phone = ?",
      [admin_phone]
    );

    res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error while verifying OTP." });
  }
}
