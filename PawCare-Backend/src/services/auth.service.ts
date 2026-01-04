import { UserRepository } from "../repositories/auth.repository";
import { CreatedUserDto, LoginUserDto} from "../dtos/user.dto";
import bcrypt from "bcryptjs";
let userRepository = new UserRepository();
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http-error";
export class AuthService{
    async registerUser (data: CreatedUserDto){
        // logic to register user, duplicate check, hash
        const emailExists = await userRepository.getUserByEmail(data.email);
        if(emailExists){ // if instance found, duplicate
            throw new Error('Email already exists');
        }
        const usernameExists = await userRepository.getUserByUsername(data.username);
        if(usernameExists){
            throw new Error('Username already exists');
        }
        // hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        // save user
        const newUser = await userRepository.createUser(data);
        return newUser;
    }

    async loginUser (data: LoginUserDto){
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        // plain text, hashed, not data.password == user.password
        if(!validPassword){
            throw new HttpError(401, "Invalid credentials");
        }
        // generate JWT token
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        } // data to be stored in token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d'});
        return {token, user}
    }

}


