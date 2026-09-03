import axiosClient from './axiosClient';

export const reportApi = {
  /**
   * Create draft weekly report
   * @param {Object} reportData conforming to ReportRequest
   */
  async createDraft(reportData) {
    const res = await axiosClient.post('/api/reports', reportData);
    return res.data;
  },

  /**
   * Update report (allowed in DRAFT or NEEDS_CORRECTION status)
   * @param {number} id
   * @param {Object} reportData
   */
  async updateReport(id, reportData) {
    const res = await axiosClient.put(`/api/reports/${id}`, reportData);
    return res.data;
  },

  /**
   * Submit report for manager review
   * @param {number} id
   */
  async submitReport(id) {
    const res = await axiosClient.post(`/api/reports/${id}/submit`);
    return res.data;
  },

  /**
   * Get single report details by ID
   * @param {number} id
   */
  async getReportById(id) {
    const res = await axiosClient.get(`/api/reports/${id}`);
    return res.data;
  },

  /**
   * Get current team member's paginated report history
   * @param {Object} params { status, page, size }
   */
  async getMyReports(params = {}) {
    const res = await axiosClient.get('/api/reports/my', { params });
    return res.data;
  },

  /**
   * Get version history snapshots for a report
   * @param {number} id
   */
  async getReportVersions(id) {
    const res = await axiosClient.get(`/api/reports/${id}/versions`);
    return res.data;
  },

  /**
   * Manager / Admin: Get filtered list of all team reports
   * @param {Object} params { week, userId, projectId, status, page, size }
   */
  async getManagerReports(params = {}) {
    const res = await axiosClient.get('/api/manager/reports', { params });
    return res.data;
  },

  /**
   * Manager / Admin: Approve report
   * @param {number} id
   */
  async approveReport(id) {
    const res = await axiosClient.post(`/api/manager/reports/${id}/approve`);
    return res.data;
  },

  /**
   * Manager / Admin: Request changes with mandatory comment
   * @param {number} id
   * @param {string} comment
   */
  async requestChanges(id, comment) {
    const res = await axiosClient.post(`/api/manager/reports/${id}/request-changes`, { comment });
    return res.data;
  }
};

export default reportApi;
