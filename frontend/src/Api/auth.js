import api from './auth.js'; 

export const login = (data)=>{
    return api.post('/api/signin',data);
}

export const signup = (data)=>{
    return api.post('/api/signup',data);
}