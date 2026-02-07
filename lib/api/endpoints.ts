// List of api routes
// Single source of truth for api endpoints

export const API = {
 AUTH:{
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    WHOAMI: '/api/auth/whoami',
    // LOGOUT: '/api/auth/logout',
    UPDATEPROFILE: '/api/auth/update-profile',
    CREATEUSER: '/api/auth/user',
    REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
 },
 ADMIN:{
    USER: {
          CREATE: '/api/admin/users',
          GET_ALL: '/api/admin/users',
          GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
          UPDATE: (id: string) => `/api/admin/users/${id}`,
          DELETE: (id: string) => `/api/admin/users/${id}`,
    },
    PET: {
        CREATE: '/api/admin/pet',
        GET_ALL: '/api/admin/pet',
        GET_BY_ID: (id: string) => `/api/admin/pet/${id}`,
        UPDATE: (id: string) => `/api/admin/pet/${id}`,
        DELETE: (id: string) => `/api/admin/pet/${id}`,
    },
    PROVIDER: {
        CREATE: '/api/admin/provider',
        GET_ALL: '/api/admin/provider',
        GET_BY_ID: (id: string) => `/api/admin/provider/${id}`,
        UPDATE: (id: string) => `/api/admin/provider/${id}`,
        DELETE: (id: string) => `/api/admin/provider/${id}`,
    },
    STATS: {
        DASHBOARD: '/api/admin/stats/dashboard',
    }
 },
 USER:{
    PET: {
        CREATE: '/api/user/pet',
        GET_ALL: '/api/user/pet',
        GET_BY_ID: (id: string) => `/api/user/pet/${id}`,
        UPDATE: (id: string) => `/api/user/pet/${id}`,
        DELETE: (id: string) => `/api/user/pet/${id}`,
    },
 }
};