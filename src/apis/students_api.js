// src/apis/students_api.js
import http from "./http";

export const get_students_api = (params = {}) => {
  return http.get("/students/", { params });
};

export const get_student_attempts_api = (id) => {
  return http.get(`/students/${id}/attempts/`);
};

