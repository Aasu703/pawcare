import { IUser, UserModel } from "../models/user.model"

export interface IUserRepository{
    createUser(data: Partial<IUser>): Promise<IUser>
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser|null>;

    // Additional Methods
    getUserById(id: string) : Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
    updateUserById(id: string, data: Partial<IUser>): Promise<IUser| null>;
    deleteUserById(id: string): Promise<boolean | null>;
}

export class UserRepository implements IUserRepository{
    getUserById(id: string): Promise<IUser | null> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<IUser[]> {
        throw new Error("Method not implemented.");
    }
    updateUserById(id: string, data: Partial<IUser>): Promise<IUser | null> {
        throw new Error("Method not implemented.");
    }
    deleteUserById(id: string): Promise<boolean | null> {
        throw new Error("Method not implemented.");
    }
    async createUser(data: Partial<IUser>){
        const newUser = new UserModel(data);
        await newUser.save(); // same as db.users.insertOne()
        return newUser;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"email":email});
        return user;
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"username": username});
        return user;
    }


}