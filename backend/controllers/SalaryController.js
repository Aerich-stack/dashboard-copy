import * as Salary from "../models/Salary.js";
import * as Attendance from "../models/Attendance.js";
import * as Notification from "../models/Notification.js";
import * as Teacher from "../models/Teacher.js";
import nodemailer from "nodemailer";

// Configure email transporter (using Gmail SMTP)
// You can replace with your own email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Function to send email
const sendPayslipEmail = (teacherEmail, teacherName, salaryData, callback) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">📄 Payslip</h1>
        <hr style="border: 1px solid #ddd;">
        
        <h2 style="color: #555;">Dear ${teacherName},</h2>
        <p style="color: #666; font-size: 16px;">Your payslip for the period <strong>${salaryData.period_start}</strong> to <strong>${salaryData.period_end}</strong> has been generated.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Salary Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Verified Hours:</td>
              <td style="padding: 10px; text-align: right; color: #333;">${salaryData.verified_hours} hours</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Hourly Rate:</td>
              <td style="padding: 10px; text-align: right; color: #333;">₱${salaryData.hourly_rate.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Basic Pay:</td>
              <td style="padding: 10px; text-align: right; color: #333;">₱${salaryData.basic_pay.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #4CAF50;">Allowances:</td>
              <td style="padding: 10px; text-align: right; color: #4CAF50;">+₱${salaryData.allowances.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #f44336;">Deductions:</td>
              <td style="padding: 10px; text-align: right; color: #f44336;">-₱${salaryData.deductions.toLocaleString()}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 15px; font-weight: bold; font-size: 18px; color: #333;">Total Salary:</td>
              <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #4CAF50;">₱${salaryData.total_salary.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          If you have any questions regarding your payslip, please contact the Human Resources department.
        </p>
        
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: teacherEmail,
    subject: `Payslip for ${salaryData.period_start} to ${salaryData.period_end}`,
    html: htmlContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      callback(error, null);
    } else {
      console.log("Email sent:", info.response);
      callback(null, info);
    }
  });
};

export const computeSalary = (req, res) => {
  const { teacher_id, period_start, period_end } = req.body;

  // Get verified hours for the period
  Attendance.getTotalHoursByTeacher(teacher_id, period_start, period_end, (err, hourResults) => {
    if (err) {
      console.error("Error computing salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    const verified_hours = hourResults[0]?.total_hours || 0;
    const hourly_rate = req.body.hourly_rate || 500; // Default hourly rate
    const computed_basic = verified_hours * hourly_rate;
    const allowances = req.body.allowances || 0;
    const deductions = req.body.deductions || 0;
    const total_salary = computed_basic + allowances - deductions;

    const salaryData = {
      teacher_id,
      period_start,
      period_end,
      verified_hours,
      hourly_rate,
      basic_pay: computed_basic,
      allowances,
      deductions,
      total_salary
    };

    Salary.createSalary(salaryData, (err, result) => {
      if (err) {
        console.error("Error creating salary record:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.status(201).json({ 
        success: true, 
        message: "Salary computed successfully", 
        salaryId: result.insertId,
        salary: salaryData
      });
    });
  });
};

export const getTeacherSalary = (req, res) => {
  const { teacherId } = req.params;

  Salary.getSalaryByTeacherId(teacherId, (err, results) => {
    if (err) {
      console.error("Error fetching salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getAllSalary = (req, res) => {
  Salary.getAllSalary((err, results) => {
    if (err) {
      console.error("Error fetching salary records:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getSalaryById = (req, res) => {
  const { id } = req.params;

  Salary.getSalaryById(id, (err, results) => {
    if (err) {
      console.error("Error fetching salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    res.status(200).json({ success: true, data: results[0] });
  });
};

export const updateSalary = (req, res) => {
  const { id } = req.params;
  const salaryData = {
    verified_hours: req.body.verified_hours,
    hourly_rate: req.body.hourly_rate,
    basic_pay: req.body.basic_pay,
    allowances: req.body.allowances,
    deductions: req.body.deductions,
    total_salary: req.body.total_salary,
    status: req.body.status || 'Generated'
  };

  Salary.updateSalary(id, salaryData, (err) => {
    if (err) {
      console.error("Error updating salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Salary updated successfully" });
  });
};

export const finalizeSalary = (req, res) => {
  const { id } = req.params;

  Salary.finalizeSalary(id, (err) => {
    if (err) {
      console.error("Error finalizing salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Salary finalized successfully" });
  });
};

// Send payslip: finalize salary record and create a notification for the teacher
export const sendPayslip = (req, res) => {
  const { id } = req.params;

  Salary.getSalaryById(id, (err, results) => {
    if (err) {
      console.error("Error fetching salary for sending:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }

    const salary = results[0];

    // Get teacher info to include name/email in notification message and for sending email
    Teacher.getTeacherById(salary.teacher_id, (tErr, tRes) => {
      if (tErr) {
        console.error("Error fetching teacher for payslip:", tErr);
        return res.status(500).json({ success: false, error: tErr.message });
      }

      const teacher = tRes && tRes[0] ? tRes[0] : null;
      const teacherName = teacher ? teacher.name : `Teacher ${salary.teacher_id}`;
      const teacherEmail = teacher ? teacher.email : null;
      
      const message = `Payslip available for ${teacherName} (${salary.period_start} to ${salary.period_end}).`;

      // Create notification
      const notificationData = {
        type: 'Info',
        message,
        related_to: 'salary',
        related_id: id
      };

      Notification.createNotification(notificationData, (nErr, nResult) => {
        if (nErr) {
          console.error("Error creating notification for payslip:", nErr);
          return res.status(500).json({ success: false, error: nErr.message });
        }

        // Send email if teacher email exists
        if (teacherEmail) {
          sendPayslipEmail(teacherEmail, teacherName, salary, (emailErr, emailInfo) => {
            if (emailErr) {
              console.warn("Warning: Email sending failed, but payslip was created:", emailErr);
              // Continue with finalization even if email fails
            } else {
              console.log("Payslip email sent successfully to:", teacherEmail);
            }

            // Finalize the salary record (mark as Finalized)
            Salary.finalizeSalary(id, (fErr) => {
              if (fErr) {
                console.error("Error finalizing salary after sending:", fErr);
                return res.status(500).json({ success: false, error: fErr.message });
              }

              return res.status(200).json({ 
                success: true, 
                message: "Payslip sent via email and salary finalized", 
                notificationId: nResult.insertId,
                emailSent: teacherEmail ? true : false
              });
            });
          });
        } else {
          console.warn("Teacher email not found, skipping email notification");
          
          // Finalize the salary record without sending email
          Salary.finalizeSalary(id, (fErr) => {
            if (fErr) {
              console.error("Error finalizing salary after sending:", fErr);
              return res.status(500).json({ success: false, error: fErr.message });
            }

            return res.status(200).json({ 
              success: true, 
              message: "Payslip finalized (email not sent - no email address available)", 
              notificationId: nResult.insertId,
              emailSent: false
            });
          });
        }
      });
    });
  });
};

export const deleteSalary = (req, res) => {
  const { id } = req.params;

  Salary.deleteSalary(id, (err) => {
    if (err) {
      console.error("Error deleting salary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Salary deleted successfully" });
  });
};

export const getSalarySummaryByPeriod = (req, res) => {
  const { periodStart, periodEnd } = req.params;

  Salary.getSalarySummaryByPeriod(periodStart, periodEnd, (err, results) => {
    if (err) {
      console.error("Error fetching salary summary:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

// Initialize tables
export const initializeTables = (req, res) => {
  Salary.createSalaryTable();
  res.status(200).json({ success: true, message: "Salary table initialized" });
};
