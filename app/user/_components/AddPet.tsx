"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { handleCreateUserPet } from "@/lib/actions/user/pet-actions";
import { AddPetData, addPetSchema } from "../schema";
import { useState, useRef } from "react";
import { Camera, PawPrint, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SPECIES_OPTIONS = [
  { value: "Dog", emoji: "🐕" },
  { value: "Cat", emoji: "🐈" },
  { value: "Bird", emoji: "🐦" },
  { value: "Rabbit", emoji: "🐇" },
  { value: "Other", emoji: "🐾" },
];

const AVATAR_PRESETS = ["/images/cat.png", "/images/kittiy.png", "/images/meow.png"];

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
        <div className="min-h-screen bg-[var(--pc-cream)] text-foreground">
            {/* Header */}
            <header className="bg-white border-b border-[var(--pc-border)] sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[var(--pc-text-muted)] hover:text-[var(--pc-primary)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="font-[var(--font-display)] text-lg font-bold text-foreground">Add New Pet</h1>
                    <div className="w-16" />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Photo Upload Card */}
                    <div className="bg-white rounded-[24px] border border-[var(--pc-border)] p-8">
                        <div className="flex flex-col items-center">
                            <Controller
                                name="image"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <>
                                        <div className="relative group">
                                            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-[var(--pc-primary-light)]">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PawPrint className="w-12 h-12 text-[var(--pc-primary)]/40" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Camera className="w-6 h-6 text-white" />
                                            </button>
                                            {previewImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissImage(onChange)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                            accept=".jpg,.jpeg,.png,.webp"
                                            className="hidden"
                                        />

                                        {/* Avatar presets */}
                                        <p className="text-xs text-[var(--pc-text-muted)] mt-4 mb-2">or choose an avatar</p>
                                        <div className="flex gap-3">
                                            {AVATAR_PRESETS.map((src) => (
                                                <button
                                                    key={src}
                                                    type="button"
                                                    onClick={() => { setPreviewImage(src); onChange(undefined); }}
                                                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                                                        previewImage === src ? "border-[var(--pc-primary)] ring-2 ring-[var(--pc-primary)]/20" : "border-[var(--pc-border)]"
                                                    }`}
                                                >
                                                    <Image src={src} alt="Avatar" width={48} height={48} className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            />
                            {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image.message}</p>}
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-[16px] p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-[10px] bg-red-100 flex items-center justify-center flex-shrink-0">
                                <X className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Pet Info Card */}
                    <div className="bg-white rounded-[24px] border border-[var(--pc-border)] p-8">
                        <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            🐾 Pet Information
                        </h2>

                        <div className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Pet Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    placeholder="e.g. Whiskers, Buddy"
                                    className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Species pills */}
                            <div>
                                <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-2 block">Species</label>
                                <Controller
                                    name="species"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex flex-wrap gap-2">
                                            {SPECIES_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => field.onChange(opt.value)}
                                                    className={`px-4 py-2.5 rounded-[12px] text-sm font-semibold border transition-all duration-200 ${
                                                        field.value === opt.value
                                                            ? "bg-[var(--pc-primary)] text-white border-[var(--pc-primary)] shadow-[0_2px_12px_rgba(232,133,90,0.3)]"
                                                            : "bg-white border-[var(--pc-border)] text-[var(--pc-text-muted)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)]"
                                                    }`}
                                                >
                                                    {opt.emoji} {opt.value}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                />
                                {errors.species && <p className="mt-1 text-xs text-red-500">{errors.species.message}</p>}
                            </div>

                            {/* Breed */}
                            <div>
                                <label htmlFor="breed" className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Breed</label>
                                <input
                                    id="breed"
                                    type="text"
                                    {...register("breed")}
                                    placeholder="e.g. Golden Retriever, Siamese"
                                    className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]"
                                />
                                {errors.breed && <p className="mt-1 text-xs text-red-500">{errors.breed.message}</p>}
                            </div>

                            {/* Age + Weight row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="age" className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Age (years)</label>
                                    <input
                                        id="age"
                                        type="number"
                                        step="0.1"
                                        {...register("age", { valueAsNumber: true })}
                                        placeholder="e.g. 3"
                                        className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]"
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="weight" className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Weight (kg)</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        {...register("weight", { valueAsNumber: true })}
                                        placeholder="e.g. 4.5"
                                        className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]"
                                    />
                                    {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-[var(--pc-primary)] text-white rounded-[14px] px-6 py-3.5 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Adding Pet…
                                </>
                            ) : (
                                "Save Pet 🐾"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="border-[1.5px] border-[var(--pc-border)] text-[var(--pc-text-muted)] rounded-[14px] px-6 py-3.5 font-semibold text-sm bg-white hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)] transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
