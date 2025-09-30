// src/apis/exam_api.js
import http from "./http";

/** 开始考试 */
export const start_exam_api = (payload) => {
  // payload: { paper_id, student: { name, student_no, email } }
  return http.post("/exam/start/", payload);
};

/** 提交试卷 */
export const submit_exam_api = (payload) => {
  // payload: { attempt_token, answers: [...], duration_seconds? }
  return http.post("/exam/submit/", payload);
};

/** 获取试卷统计（管理端） */
export const get_paper_stats_api = (paperId, params = {}) => {
  // params 可以包含 { wrong_choices: 1 } 以返回错误选项分布
  return http.get(`/admin/papers/${paperId}/stats/`, { params });
};

/** 获取单题选项统计（管理端） */
export const get_question_choice_stats_api = (questionId) => {
  return http.get(`/admin/questions/${questionId}/choice-stats/`);
};
