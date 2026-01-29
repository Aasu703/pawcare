"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import {toast} from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";



const updateSchema = z.object({
    firstName: z.string().min(2, "2 characters"),
    lastName: z.string().min(2, "2 characters")
});
type UpdateData = z.infer<typeof updateSchema>;

export default function UpdateForm(
    { user } : { user : any } // any can be replaced with interface/types
) {
    const { register, handleSubmit, formState: { errors } } = useForm<UpdateData>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || ""
        }
    });
    const onSubmit = async (data: UpdateData) => {
        toast.success("Profile updated successfully!");
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    user.imageUrl && 
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL + user.imageUrl}
                        alt="Profile Image"
                        width={100}
                        height={100}
                        className="rounded-full mb-4"
                    />
                }
                <div>
                    <label>First Name:</label>
                    <input type="text" {...register("firstName")} className="ml-2 border rounded" />
                    {errors.firstName && <span>{errors.firstName.message}</span>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" {...register("lastName")} className="ml-2 border rounded" />
                    {errors.lastName && <span>{errors.lastName.message}</span>}
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Update Profile
                </button>
            </form>
        </div>
    );
}