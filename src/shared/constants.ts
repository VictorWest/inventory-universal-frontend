export const BACKEND_BASE_URL = "http://localhost:3000/api"

export const LOGIN_API_URL = `${BACKEND_BASE_URL}/auth/login`
export const REGISTER_API_URL = `${BACKEND_BASE_URL}/auth/register`
export const updateIndustry = (userEmail: string, industry: string) => `${BACKEND_BASE_URL}/user/update-industry/${userEmail}?industry=${industry}`