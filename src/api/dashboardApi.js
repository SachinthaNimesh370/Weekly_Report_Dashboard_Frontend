import axiosClient from './axiosClient';

export const dashboardApi = {
  /**
   * 1. Get summary metrics card data
   * @param {string} week (YYYY-MM-DD)
   */
  async getSummary(week) {
    const res = await axiosClient.get('/api/manager/dashboard/summary', { params: { week } });
    return res.data;
  },

  /**
   * 2. Get member submission status including NOT_STARTED
   * @param {string} week (YYYY-MM-DD)
   */
  async getMemberStatus(week) {
    const res = await axiosClient.get('/api/manager/dashboard/status', { params: { week } });
    return res.data;
  },

  /**
   * 3. Get tasks completed trend data
   * @param {number} weeks (default 6)
   */
  async getTasksTrend(weeks = 6) {
    const res = await axiosClient.get('/api/manager/dashboard/tasks-trend', { params: { weeks } });
    return res.data;
  },

  /**
   * 4. Get workload distribution by project
   * @param {string} week (YYYY-MM-DD)
   */
  async getProjectWorkload(week) {
    const res = await axiosClient.get('/api/manager/dashboard/projects', { params: { week } });
    return res.data;
  },

  /**
   * 5. Get time distribution by task type
   * @param {string} week (YYYY-MM-DD)
   */
  async getTimeDistribution(week) {
    const res = await axiosClient.get('/api/manager/dashboard/time-distribution', { params: { week } });
    return res.data;
  },

  /**
   * 6. Get recent activity feed
   * @param {number} limit (default 10)
   */
  async getRecentActivity(limit = 10) {
    const res = await axiosClient.get('/api/manager/dashboard/activity', { params: { limit } });
    return res.data;
  }
};

export default dashboardApi;
