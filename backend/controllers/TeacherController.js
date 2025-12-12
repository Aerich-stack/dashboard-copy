import * as Teacher from "../models/Teacher.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailService.js";

export const createTeacher = async (req, res) => {
  const teacherData = {
    email: req.body.email,
    name: req.body.name,
    department: req.body.department,
    basic_pay: req.body.basic_pay || 0,
    password: req.body.password || null
  };

  Teacher.createTeacher(teacherData, async (err, result) => {
    if (err) {
      console.error("Error creating teacher:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    
    // Send welcome email if password is provided
    if (teacherData.password) {
      const emailResult = await sendWelcomeEmail(teacherData.email, teacherData.name, teacherData.password);
      if (!emailResult.success) {
        console.error('Failed to send welcome email:', emailResult.error);
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: "Teacher created successfully", 
      teacherId: result.insertId 
    });
  });
};

export const getAllTeachers = (req, res) => {
  Teacher.getAllTeachers((err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getTeacherById = (req, res) => {
  const { id } = req.params;

  Teacher.getTeacherById(id, (err, results) => {
    if (err) {
      console.error("Error fetching teacher:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, data: results[0] });
  });
};

export const updateTeacher = (req, res) => {
  const { id } = req.params;
  const teacherData = {
    email: req.body.email,
    name: req.body.name,
    department: req.body.department,
    basic_pay: req.body.basic_pay || 0,
    bio: req.body.bio || null,
    phone: req.body.phone || null,
    address: req.body.address || null,
    profile_image: req.body.profile_image || null
  };

  Teacher.updateTeacher(id, teacherData, (err) => {
    if (err) {
      console.error("Error updating teacher:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Teacher updated successfully" });
  });
};

export const deleteTeacher = (req, res) => {
  const { id } = req.params;

  Teacher.deleteTeacher(id, (err) => {
    if (err) {
      console.error("Error deleting teacher:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Teacher deleted successfully" });
  });
};

export const loginTeacher = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

  Teacher.getTeacherByEmailAndPassword(email, password, (err, results) => {
    if (err) {
      console.error('Error during teacher login:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const teacher = results[0];
    res.status(200).json({ success: true, data: teacher });
  });
};

export const changePassword = (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Current and new password are required' });

  // Verify current password
  Teacher.getTeacherById(id, (err, results) => {
    if (err) {
      console.error('Error fetching teacher for password change:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!results || results.length === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });
    const teacher = results[0];
    if ((teacher.password || '') !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    Teacher.changeTeacherPassword(id, newPassword, (uErr) => {
      if (uErr) {
        console.error('Error updating teacher password:', uErr);
        return res.status(500).json({ success: false, error: uErr.message });
      }
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    });
  });
};

// Initialize tables
export const initializeTables = (req, res) => {
  Teacher.createTeacherTable();
  res.status(200).json({ success: true, message: "Teacher table initialized" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  Teacher.getTeacherByEmail(email, async (err, results) => {
    if (err) {
      console.error('Error looking up email:', err);
      return res.status(200).json({ success: true, message: 'If the account exists, reset instructions have been sent' });
    }
    if (!results || results.length === 0) {
      // Security: return success even if email doesn't exist
      return res.status(200).json({ success: true, message: 'If the account exists, reset instructions have been sent' });
    }
    
    // Get teacher details
    const teacher = results[0];
    
    // Generate reset token
    const token = 'reset-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Store reset token in database
    Teacher.storeResetToken(email, token, async (storeErr) => {
      if (storeErr) {
        console.error('Error storing reset token:', storeErr);
        return res.status(200).json({ success: true, message: 'If the account exists, reset instructions have been sent' });
      }
      
      // Send password reset email with token and email
      const emailResult = await sendPasswordResetEmail(email, token, teacher.name);
      
      if (emailResult.success) {
        console.log(`Password reset email sent to ${email}`);
        res.status(200).json({ success: true, message: 'Password reset instructions have been sent to your email' });
      } else {
        console.error('Failed to send email:', emailResult.error);
        // Still return success for security, but log the error
        res.status(200).json({ success: true, message: 'Check your email for reset instructions' });
      }
    });
  });
};

// Reset password using token
export const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  
  if (!token || !email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token, email, and new password are required' });
  }

  // Verify token and email match
  Teacher.getTeacherByResetToken(token, async (err, results) => {
    if (err) {
      console.error('Error verifying reset token:', err);
      return res.status(500).json({ success: false, message: 'Error resetting password' });
    }

    if (!results || results.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const teacher = results[0];
    if (teacher.email !== email) {
      return res.status(400).json({ success: false, message: 'Email does not match the reset token' });
    }

    // Update password and clear reset token
    Teacher.resetPasswordByToken(token, email, newPassword, (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ success: false, message: 'Error resetting password' });
      }

      res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    });
  });
};
