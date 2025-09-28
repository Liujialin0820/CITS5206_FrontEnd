import http from "./http";

/** Get list */
export const get_test_papers_api = (params) =>
  http.get("/test-papers/", params);

/** Delete */
export const delete_test_paper_api = (id) =>
  http.delete(`/test-papers/${id}/`);

/** Publish */
export const publish_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/publish/`);

/** Unpublish */
export const unpublish_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/unpublish/`);

/** Generate */
export const generate_test_paper_api = (id) =>
  http.post(`/test-papers/${id}/generate/`);
