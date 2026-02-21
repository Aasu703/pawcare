"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleCreateUserPet } from "@/lib/actions/user/pet-actions";
import { AddPetData, addPetSchema } from "../schema";
import { useState, useRef } from "react";
import { Camera, Heart, PawPrint, ArrowLeft, Save, X, Dog, Cat } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddPetForm() {
    const router = useRouter();
    const { register, handleSubmit, control, formState: {errors, isSubmitting} } = useForm<AddPetData>({
        resolver: zodResolver(addPetSchema),
        defaultValues: {
            name: "",
            species: "",
            breed: "",
            age: 0,
            weight: 0,
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const onSubmit = async (data: any) => {
        setError(null);
        try {
            const formData = {
                name: data.name,
                species: data.species,
                breed: data.breed,
                age: data.age,
                weight: data.weight,
                image: data.image,
            };

            const response = await handleCreateUserPet(formData);

            if (!response.success) {
                throw new Error(response.message || "Failed to add pet.");
            }

            toast.success("Pet added successfully!");
            const createdPetId = response.data?._id || response.data?.id;
            if (createdPetId) {
                router.push(`/user/pet/${createdPetId}/care`);
                return;
            }
            router.push("/user/pet");
        } catch (data: any) {
            setError(data.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-100 text-gray-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 bg-green-300/20 rounded-full blur-3xl"
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
                        className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Add New Pet</h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Pet Image Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                {/* Pet Image Display */}
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Pet Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                                            <PawPrint className="w-20 h-20 text-gray-900" />
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
                                className="mt-4 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all text-sm font-medium text-gray-700 hover:text-green-600"
                            >
                                Add Photo
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

                    {/* Pet Information Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-green-600" />
                            Pet Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pet Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Pet Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        type="text"
                                        {...register("name")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter your pet's name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Species */}
                            <div className="space-y-2">
                                <label htmlFor="species" className="block text-sm font-semibold text-gray-700">
                                    Species
                                </label>
                                <div className="relative">
                                    <select
                                        id="species"
                                        {...register("species")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white/50"
                                    >
                                        <option value="">Select species</option>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {errors.species && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.species.message}
                                    </p>
                                )}
                            </div>

                            {/* Breed */}
                            <div className="space-y-2">
                                <label htmlFor="breed" className="block text-sm font-semibold text-gray-700">
                                    Breed
                                </label>
                                <div className="relative">
                                    <input
                                        id="breed"
                                        type="text"
                                        {...register("breed")}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter breed"
                                    />
                                </div>
                                {errors.breed && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.breed.message}
                                    </p>
                                )}
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                                    Age (years)
                                </label>
                                <div className="relative">
                                    <input
                                        id="age"
                                        type="number"
                                        step="0.1"
                                        {...register("age", { valueAsNumber: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter age"
                                    />
                                </div>
                                {errors.age && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.age.message}
                                    </p>
                                )}
                            </div>

                            {/* Weight */}
                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">
                                    Weight (kg)
                                </label>
                                <div className="relative">
                                    <input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        {...register("weight", { valueAsNumber: true })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-white/50"
                                        placeholder="Enter weight in kg"
                                    />
                                </div>
                                {errors.weight && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        {errors.weight.message}
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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Adding Pet...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Add Pet
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
