// apis/admin_api.js
// All comments in English

import http from "./http";

/**
 * Create Question API
 * - Send multipart/form-data
 * - "choices" is sent as a JSON string
 * - "images" are sent as multiple files under the same key
 */
export const create_question_api = (form) => {
  const path = "/questions/";

  const fd = new FormData();
  fd.append("name", form.name);
  fd.append("type", form.type);
  fd.append("level", form.level);
  fd.append("category", form.category);
  fd.append("marks", form.marks);
  fd.append("question_text", form.question);
  fd.append("choices_json", JSON.stringify(form.choices));
  fd.append("choices", JSON.stringify(form.choices));

  // Append images (multiple)
  (form.images || []).forEach((file) => {
    fd.append("images", file);
  });

  // NOTE: Your http.post only takes (path, data) and returns response.data
  return http.post(path, fd);
};

/**
 * Get all questions
 * - Returns list of questions with nested choices and images
 * - Backend: QuestionReadSerializer
 */
export const get_questions_api = (params = {}) => {
  const path = "/questions/";
  // params can include pagination, filters etc.
  return http.get(path, params);
};

/**
 * Delete Question API
 * @param {number|string} id - Question ID
 */
export const delete_question_api = (id) => {
  const path = `/questions/${id}/`;
  return http.delete(path);
};

/**
 * Get single question by id
 */
export const get_question_detail_api = (id) => {
  const path = `/questions/${id}/`;
  return http.get(path);
};

/**
 * Update question
 */
export const update_question_api = (id, form) => {
  const path = `/questions/${id}/`;

  const fd = new FormData();
  fd.append("name", form.name);
  fd.append("type", form.type);
  fd.append("level", form.level);
  fd.append("category", form.category);
  fd.append("marks", form.marks);
  fd.append("question_text", form.question);

  const choicesPayload = form.choices.map((c, i) => ({
    text: c.text,
    is_correct: form.correctIndex.includes(i),
  }));
  fd.append("choices_json", JSON.stringify(choicesPayload));

  if (form.image) {
    fd.append("image", form.image); // ✅ 单文件
  }
  return http.put(path, fd);
};
