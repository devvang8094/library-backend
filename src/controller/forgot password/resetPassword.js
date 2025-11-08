import { connection, Connection } from "../../config/dbconfig.js";
import bcrypt from "bcrypt";

export async function resetPassword(req, res) {
  try {
    const { admin_phone, new_password } = req.body;

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await connection.query(
      "UPDATE admin SET admin_pass = ? WHERE admin_phone = ?",
      [hashedPassword, admin_phone]
    );

    res.json({
      success: true,
      message: "Password reset successfully. Please login.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error while resetting password." });
  }
}
