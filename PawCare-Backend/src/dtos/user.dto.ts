import z from "zod";
import { userSchema } from "../types/user.type";
export const CreatedUserDto = userSchema.pick({ // re use userSchema
    firstName: true, // true - include from userSchema
    lastName: true,
    email: true,
    username: true,
    password: true
}
).extend({ // add new attribute to schema
    confrimPassword: z.string().min(6)
}).refine( // extra validation from existing attributes
    (data) => data.password === data.confrimPassword,
    {
        message: "Password and Confirm Password must be same",
        path: ["confrimPassword"] // throws error
    }
)

export type CreatedUserDto = z.infer<typeof CreatedUserDto>;

export const LoginUserDto = z.object({
    email: z.email(),
    password: z.string().min(6)
})
export type LoginUserDto = z.infer<typeof LoginUserDto>;

