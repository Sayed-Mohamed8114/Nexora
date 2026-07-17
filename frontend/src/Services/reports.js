import api from "@/Api/axios"

export const getReports = async ()=> {
    const response = await api.get("/api/Reports");
    return response.data;
}

export const rateCourse = async (body) => {
    const response  = await api.post("/api/Reports",body) ;
    return response.data;
}