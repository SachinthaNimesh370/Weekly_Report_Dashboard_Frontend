import axiosClient from './axiosClient';

export const userApi = {
  /**
   * Get all users (Admin & Manager)
   */
  async getAllUsers() {
    const res = await axiosClient.get('/api/users');
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get single user by ID
   * @param {number} id
   */
  async getUserById(id) {
    const res = await axiosClient.get(`/api/users/${id}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update user active status (Admin only)
   * @param {number} id
   * @param {boolean} isActive
   */
  async updateUserStatus(id, isActive) {
    const res = await axiosClient.patch(`/api/users/${id}/status`, { isActive });
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update user role (Admin only)
   * @param {number} id
   * @param {string} role 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_TEAM_MEMBER'
   */
  async updateUserRole(id, role) {
    const res = await axiosClient.patch(`/api/users/${id}/role`, { role });
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Create/Invite a new user (Admin only)
   * @param {Object} userData { fullName, email, password, role, department }
   */
  async createUser(userData) {
    const res = await axiosClient.post('/api/users', userData);
    return res?.data !== undefined ? res.data : res;
  }
};

export default userApi;
