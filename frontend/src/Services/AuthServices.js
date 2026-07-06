import api from "../Api/axios" ; 

export const login = async (userData) => {
    const response = await api.post("/api/Auth/login",userData);
    return response.data;
}

export const register  = async (userData)=>{
    console.log(userData)
    const response =await api.post('/api/Auth/register',userData);
    return response.data;
}