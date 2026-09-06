import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Login user and get JWT token
   * @param {Object} credentials { email, password }
   */
  async login({ email, password }) {
    const res = await axiosClient.post('/api/auth/login', { email, password });
    const payload = res?.data || res;
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload));
    }
    return payload;
  },

  /**
   * Register new user
   * @param {Object} data { fullName, email, password, role }
   */
  async register(data) {
    const res = await axiosClient.post('/api/auth/register', data);
    const payload = res?.data || res;
    if (payload?.token) {
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload));
    }
    return payload;
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    const res = await axiosClient.get('/api/auth/me');
    return res?.data || res;
  },

  /**
   * Discard JWT token from local session
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authApi;
