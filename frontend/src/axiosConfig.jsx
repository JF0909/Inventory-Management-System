import axios from 'axios';

// create axios instance
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001'
  baseURL: 'http://3.26.10.113:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;