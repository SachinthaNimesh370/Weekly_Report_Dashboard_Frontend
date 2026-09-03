import axiosClient from './axiosClient';

export const projectApi = {
  /**
   * Get active projects (accessible by all authenticated users)
   */
  async getActiveProjects() {
    const res = await axiosClient.get('/api/projects');
    return res.data;
  },

  /**
   * Get all projects including inactive (Manager, Admin)
   */
  async getAllProjects() {
    const res = await axiosClient.get('/api/projects/all');
    return res.data;
  },

  /**
   * Get projects assigned to current user
   */
  async getMyProjects() {
    const res = await axiosClient.get('/api/projects/my');
    return res.data;
  },

  /**
   * Get single project by ID
   */
  async getProjectById(projectId) {
    const res = await axiosClient.get(`/api/projects/${projectId}`);
    return res.data;
  },

  /**
   * Create new project (Admin, Manager)
   * @param {Object} data { name, description }
   */
  async createProject(data) {
    const res = await axiosClient.post('/api/projects', data);
    return res.data;
  },

  /**
   * Update project (Admin, Manager)
   * @param {number} projectId
   * @param {Object} data { name, description, isActive }
   */
  async updateProject(projectId, data) {
    const res = await axiosClient.put(`/api/projects/${projectId}`, data);
    return res.data;
  },

  /**
   * Deactivate project (Admin only)
   */
  async deactivateProject(projectId) {
    const res = await axiosClient.delete(`/api/projects/${projectId}`);
    return res.data;
  },

  /**
   * Assign users to project (Admin, Manager)
   * @param {number} projectId
   * @param {Array<number>} userIds
   */
  async assignUsers(projectId, userIds) {
    const res = await axiosClient.post(`/api/projects/${projectId}/members`, { userIds });
    return res.data;
  },

  /**
   * Remove user from project
   */
  async removeUser(projectId, userId) {
    const res = await axiosClient.delete(`/api/projects/${projectId}/members/${userId}`);
    return res.data;
  },

  /**
   * Get members assigned to a project
   */
  async getProjectMembers(projectId) {
    const res = await axiosClient.get(`/api/projects/${projectId}/members`);
    return res.data;
  }
};

export default projectApi;
