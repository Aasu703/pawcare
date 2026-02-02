import z, { email } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]; 

export const UserSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string().min(8, {message: "Confirm Password must be at least 8 characters long"}),
    Firstname: z.string().min(2, {message: "First name must be at least 2 characters long"}),
    Lastname: z.string().min(2, {message: "Last name must be at least 2 characters long"}),
    phone: z.string().min(10, {message: "Phone number must be at least 10 digits long"}).optional(),
    role: z.enum(["user", "admin", "provider"]).default("user"),
    imageUrl: z.instanceof(File).optional().refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }).refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, and .png formats are accepted",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})