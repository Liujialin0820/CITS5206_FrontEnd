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

  // Send choices as a JSON string (DRF JSONField-friendly)
  const choicesPayload = form.choices.map((c, i) => ({
    text: c.text,
    is_correct: form.correctIndex.includes(i),
  }));
  fd.append("choices", JSON.stringify(choicesPayload));

  // Append images (multiple)
  (form.images || []).forEach((file) => {
    fd.append("images", file);
  });

  // NOTE: Your http.post only takes (path, data) and returns response.data
  return http.post(path, fd);
};
