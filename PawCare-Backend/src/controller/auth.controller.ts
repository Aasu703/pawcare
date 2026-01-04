import { AuthService } from "../services/auth.service";
import { CreatedUserDto , LoginUserDto} from "../dtos/user.dto";
import z, { success } from "zod";
import { Request, Response } from "express";
let authServie = new AuthService();
export class AuthController{
    async registerUser(req: Request, res: Response){
        try{
            // validate request body
            const parsedData = CreatedUserDto.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json({
                    success: false, message: z.prettifyError(parsedData.error)
                })
            }
            const newUser = await authServie.registerUser(parsedData.data);
            return res.status(201).json({
                success: true,
                data: newUser,
                message: "User registered successfully"
            });
        }catch(error:any){
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error"   
            });
        }
    }
    async loginUser(req: Request, res: Response){
        try{
            // validate request body
            const parsedData = LoginUserDto.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json({
                    success: false, message: z.prettifyError(parsedData.error)
                })
            }
            const {token, user} = await authServie.loginUser(parsedData.data);
            return res.status(200).json({
                success: true,
                data: {token, user},
                message: "User logged in successfully"
            });
            
        } catch(error: Error | any){
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal server error"
            })
        }
    }
}