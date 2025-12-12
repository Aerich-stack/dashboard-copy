-- Sample Data for Teacher Payroll Management System
-- Run this after database tables are created

-- Insert Teachers
INSERT INTO teachers (email, name, department, basic_pay) VALUES
('john@school.com', 'John Smith', 'Mathematics', 25000),
('mary@school.com', 'Mary Johnson', 'English', 24000),
('robert@school.com', 'Robert Brown', 'Science', 26000),
('sarah@school.com', 'Sarah Davis', 'History', 23000),
('michael@school.com', 'Michael Wilson', 'Physical Education', 22000);

-- Insert Teaching Load
INSERT INTO teaching_load (teacher_id, subject, class_section, day, start_time, end_time) VALUES
(1, 'Mathematics', 'Class 1-A', 'Monday', '08:00:00', '10:00:00'),
(1, 'Mathematics', 'Class 2-B', 'Tuesday', '10:30:00', '12:30:00'),
(2, 'English', 'Class 1-C', 'Monday', '10:00:00', '12:00:00'),
(2, 'English', 'Class 3-D', 'Wednesday', '08:00:00', '10:00:00'),
(3, 'Science', 'Class 2-E', 'Thursday', '08:00:00', '10:00:00'),
(3, 'Science', 'Class 4-F', 'Friday', '10:30:00', '12:30:00'),
(4, 'History', 'Class 1-G', 'Monday', '12:00:00', '14:00:00'),
(4, 'History', 'Class 3-H', 'Tuesday', '14:00:00', '16:00:00'),
(5, 'Physical Education', 'Class 1-A', 'Wednesday', '14:00:00', '16:00:00'),
(5, 'Physical Education', 'Class 2-B', 'Friday', '12:00:00', '14:00:00');

-- Insert Sample Attendance
INSERT INTO attendance (teacher_id, subject, class_section, date, hours_taught, status) VALUES
(1, 'Mathematics', 'Class 1-A', '2024-01-15', 2.5, 'Verified'),
(1, 'Mathematics', 'Class 2-B', '2024-01-16', 2.0, 'Verified'),
(2, 'English', 'Class 1-C', '2024-01-15', 2.0, 'Verified'),
(2, 'English', 'Class 3-D', '2024-01-17', 2.5, 'Submitted'),
(3, 'Science', 'Class 2-E', '2024-01-18', 3.0, 'Verified'),
(3, 'Science', 'Class 4-F', '2024-01-19', 2.5, 'Pending'),
(4, 'History', 'Class 1-G', '2024-01-15', 2.0, 'Verified'),
(4, 'History', 'Class 3-H', '2024-01-16', 2.5, 'Submitted'),
(5, 'Physical Education', 'Class 1-A', '2024-01-17', 2.0, 'Verified'),
(5, 'Physical Education', 'Class 2-B', '2024-01-18', 2.5, 'Verified');

-- Insert Sample Salaries
INSERT INTO salary (teacher_id, period_start, period_end, verified_hours, hourly_rate, basic_pay, allowances, deductions, total_salary, status) VALUES
(1, '2024-01-01', '2024-01-31', 36.0, 500, 18000, 2000, 1500, 18500, 'Finalized'),
(2, '2024-01-01', '2024-01-31', 32.5, 500, 16250, 2000, 1250, 17000, 'Generated'),
(3, '2024-01-01', '2024-01-31', 38.0, 500, 19000, 2000, 1800, 19200, 'Finalized'),
(4, '2024-01-01', '2024-01-31', 28.0, 500, 14000, 1500, 1000, 14500, 'Draft'),
(5, '2024-01-01', '2024-01-31', 34.0, 500, 17000, 1500, 1600, 16900, 'Finalized');

-- Insert Sample Notifications
INSERT INTO notifications (type, message, related_to, related_id) VALUES
('Alert', 'Missing attendance submission for Class 1-A on 2024-01-20', 'Attendance', 4),
('Info', 'Salary for January computed for John Smith', 'Salary', 1),
('Warning', 'Teacher Robert Brown has low hours this period', 'Attendance', 6),
('Info', 'New teaching load assigned to Sarah Davis', 'Teaching Load', 8);
