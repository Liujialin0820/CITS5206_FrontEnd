// src/apis/stats_api.js
import http from "./http";


export const get_global_stats_api = () => {
  return http.get("/exam/admin/global-stats/");
};
