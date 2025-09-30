import http from "./http";


export const create_test_paper_api = (form) => {
  const path = "/test-papers/";
  return http.post(path, form);
};

export const get_test_papers_api = (params = {}) => {
  const path = "/test-papers/";
  return http.get(path, params);
};

export const get_test_paper_api = (id) => {
  return http.get(`/test-papers/${id}/`);
};

export const get_test_paper_result_api = (id) => {
  return http.get(`/exam/admin/papers/${id}/result/`);
};

export const get_exam_api = (id) => {
  return http.get(`/test-papers/${id}/generate/`);
};

export const update_test_paper_api = (id, form) => {
  return http.put(`/test-papers/${id}/`, form);
};

export const delete_test_paper_api = (id) => {
  const path = `/test-papers/${id}/`;
  return http.delete(path);
};

/** Publish */
export const publish_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/publish/`);

/** Unpublish */
export const unpublish_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/unpublish/`);

/** Generate */
export const generate_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/generate/`);

// 根据考试名称获取试卷 ID
export async function get_test_paper_id_by_name(name) {
  const data = await http.get("/test-papers/", { params: { search: name } });
  const results = data.results || data;
  const target = results.find((p) => p.title === name);
  return target ? target.id : null;
}