// server side processing of both actions
"use server";
import { set } from "zod";
import { register, login } from "../api/auth";
import { setAuthToken,  setUserData} from "../cookie";

export const handleRegister = async (userData: any) => {
    try{
        //how to get data from component
        const result=await register(userData);
        // how to send back to component
        if(result.success){
            return {
                success: true,
                message: "Registration successful",
                data: result.data
                };
        }
        return {
            success: false,
            message: result.message  ||"Registration failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message  ||"Registration failed"
        };
    }
}

export const handleLogin = async (loginData: any) => {
    try{
        const result=await login(loginData);
        if(result.success){
            await setAuthToken(result.token);
            await setUserData(result.data);
            return {
                success: true,
                message: "Login successful",
                data: result.data,
                token: result.token
                };
        }
        return {
            success: false,
            message: result.message  ||"Login failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message  ||"Login failed"
        };
    }
}

