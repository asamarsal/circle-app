import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const APISemuanya = {
  auth: {
    login: async (data: { identifier: string; password: string }) => {
      return api.post('/auth/login', data);
    },
    register: async (data: { full_name: string; username: string; email: string; password: string }) => {
      return api.post('/auth/register', data);
    },
  },
  threads: {
    //Fetch
    getAll: async () => {
      const token = localStorage.getItem('token');
      return api.get('/thread', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    create: async (data: { content: string, image?: File | null }) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('content', data.content);
        
        if (data.image && data.image instanceof File) {
            formData.append('image', data.image);
        }

        const response = await fetch(`${API_URL}/thread`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const responseData = await response.json();
        return { data: responseData };
    }
  },
};