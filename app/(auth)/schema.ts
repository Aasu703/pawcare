import z from "zod";
// For login validation
export const loginSchema = z.object({
    email: z.email({ message:"Please enter a valid email"}),
    password: z.string().min(8, {message : "Password must be of 8 characters"}),
});

export type LoginData = z.infer<typeof loginSchema>;

// For registration validation
export const registerSchema = z.object({
    Firstname : z.string().min(2, {message : "Invalid name"  }),
    Lastname :z.string().min(2, {message :"Invalid name"}),
    email: z.email({ message:"Please enter a valid email"}),
    phoneNumber: z.string().min(10, {message : "Phone number is required"}).max(15, {message: "Phone number is too long"}),
    password: z.string().min(8, {message : "Password must be of 8 characters"}),
    confirmPassword: z.string().min(8, {message : "Password must be of 8 characters"}),
}).refine((v) => v.password === v.confirmPassword,{
    path: ["confirmPassword"],
    message : "Please match the passwords..."
});

export type RegisterData = z.infer<typeof registerSchema>;

