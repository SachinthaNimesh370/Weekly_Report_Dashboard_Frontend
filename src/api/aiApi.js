import axiosClient from './axiosClient';

export const aiApi = {
  /**
   * Send question or prompt to AI assistant
   * @param {string} message
   */
  async sendMessage(message) {
    const res = await axiosClient.post('/api/ai/chat', { message });
    return res?.data !== undefined ? res.data : res;
  }
};

export default aiApi;
