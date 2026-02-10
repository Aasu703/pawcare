"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";
import { UpdateUserData, updateUserSchema } from "../schema";
import { useState, useRef } from "react";
import { Camera, Mail, Phone, User, UserCircle, ArrowLeft, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateUserForm({
    user
}: {user : any}) {
    const router = useRouter();
    const { register, handleSubmit, control, formState: {errors, isSubmitting} } = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            Firstname: user?.Firstname || user?.firstName || user?.firstname || "",
            Lastname: user?.Lastname || user?.lastName || user?.lastname || "",
            PhoneNumber: user?.PhoneNumber || user?.phoneNumber || user?.phone || "",
            email: user?.email || "",
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const rawImageUrl =
        user?.imageUrl ||
        user?.image ||
        user?.avatar ||
        user?.profileImage ||
        user?.profileImageUrl ||
        "";
    const imageSrc = rawImageUrl
        ? rawImageUrl.startsWith("http")
            ? rawImageUrl
            : `${baseUrl}${rawImageUrl}`
        : "";

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange? : (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);
        try{
            if (!user?._id) {
                throw new Error("Missing user id.");
            }
            const formData = new FormData();
            formData.append("Firstname", data.Firstname);
            formData.append("Lastname", data.Lastname);
            formData.append("phone", data.PhoneNumber);
            formData.append("email", data.email);
            if (data.image) {
                formData.append("image", data.image);
            }
            const response = await handleUpdateProfile(user?._id, formData);

            if(!response.success) {
                throw new Error(response.message || "Failed to update profile.");
            }
            toast.success("Profile updated successfully.");
            router.refresh();
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred."); 
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                    style={{
                        top: '20%',
                        left: `${10 + mousePosition.x * 0.01}%`,
                        transition: "all 0.3s ease-out"
                    }}
                />
                <div 
                    className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
                    style={{
                        bottom: '10%',
                        right: `${15 + mousePosition.y * 0.01}%`,
                        transition: "all 0.3s ease-out"
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-200 backdrop-blur-xl bg-white/80">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Profile Image Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                {/* Profile Image Display */}
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Profile"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                                            <UserCircle className="w-20 h-20 text-gray-900" />
                                        </div>
                                    )}
                                </div>

                                {/* Camera Overlay */}
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Camera className="w-8 h-8 text-white" />
                                            </button>

                                            {previewImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissImage(onChange)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                                accept=".jpg,.jpeg,.png,.webp"
                                                className="hidden"
                                            />
                                        </>
                                    )}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 px-4 py-2 rounded-lg border border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-all text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                Change Photo
                            </button>

                            {errors.image && (
                                <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <X className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <User className="w-6 h-6 text-primary" />
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                    First Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="firstName"
                                        type="text"
                                        {...register("Firstname")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                {errors.Firstname && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.Firstname.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="lastName"
                                        type="text"
                                        {...register("Lastname")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                                {errors.Lastname && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.Lastname.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-blue-600" />
                            Contact Information
                        </h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white/50"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        {...register("PhoneNumber")}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white/50"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                {errors.PhoneNumber && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.PhoneNumber.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 sm:flex-none px-6 py-4 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
