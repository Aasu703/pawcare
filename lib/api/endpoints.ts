// List of api routes
// Single source of truth for api endpoints

export const API = {
 AUTH:{
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    WHOAMI: '/api/auth/whoami',
    // LOGOUT: '/api/auth/logout',
   UPDATEPROFILE: '/api/auth/update-profile',
 },
 ADMIN:{
    USER: {
        CREATE: '/api/admin/user/create',
        GET_ALL_USERS: '/api/admin/user/get-all-users',
        // Add other user-related admin endpoints here
    }
 }
};