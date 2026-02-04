import z, { email } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const updateUserSchema = z.object({
    Firstname: z.string().min(1, "First name is required").max(50, "First name is too long"),
    Lastname: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
    PhoneNumber: z.string().min(10, "Phone number is required").max(15, "Phone number is too long"),
    email: z.string().email("Invalid email address"),
    image: z
        .instanceof(File)
        .optional()
        .refine((file)=> !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, and .png formats are accepted",
        }),

    
})

export type UpdateUserData = z.infer<typeof updateUserSchema>;