import * as TeachingLoad from "../models/TeachingLoad.js";

export const createTeachingLoad = (req, res) => {
  const loadData = {
    teacher_id: req.body.teacher_id,
    subject: req.body.subject,
    class_section: req.body.class_section,
    day: req.body.day,
    start_time: req.body.start_time,
    end_time: req.body.end_time
  };

  TeachingLoad.createTeachingLoad(loadData, (err, result) => {
    if (err) {
      console.error("Error creating teaching load:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      message: "Teaching load created successfully", 
      loadId: result.insertId 
    });
  });
};

export const getTeacherTeachingLoad = (req, res) => {
  const { teacherId } = req.params;

  TeachingLoad.getTeachingLoadByTeacherId(teacherId, (err, results) => {
    if (err) {
      console.error("Error fetching teaching load:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getAllTeachingLoads = (req, res) => {
  TeachingLoad.getAllTeachingLoads((err, results) => {
    if (err) {
      console.error("Error fetching teaching loads:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getTeachingLoadById = (req, res) => {
  const { id } = req.params;

  TeachingLoad.getTeachingLoadById(id, (err, results) => {
    if (err) {
      console.error("Error fetching teaching load:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Teaching load not found" });
    }
    res.status(200).json({ success: true, data: results[0] });
  });
};

export const updateTeachingLoad = (req, res) => {
  const { id } = req.params;
  const loadData = {
    subject: req.body.subject,
    class_section: req.body.class_section,
    day: req.body.day,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    status: req.body.status || 'Active'
  };

  TeachingLoad.updateTeachingLoad(id, loadData, (err) => {
    if (err) {
      console.error("Error updating teaching load:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Teaching load updated successfully" });
  });
};

export const deleteTeachingLoad = (req, res) => {
  const { id } = req.params;

  TeachingLoad.deleteTeachingLoad(id, (err) => {
    if (err) {
      console.error("Error deleting teaching load:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Teaching load deleted successfully" });
  });
};

// Initialize tables
export const initializeTables = (req, res) => {
  TeachingLoad.createTeachingLoadTable();
  res.status(200).json({ success: true, message: "Teaching load table initialized" });
};
