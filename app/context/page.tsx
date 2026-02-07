"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken"); // adjust key to your app
        if (token) {
            router.replace("/dashboard");
        }
    }, [router]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Context Page</h1>
                <p className="text-gray-700">
                    This page demonstrates context functionality in Next.js.
                </p>
            </div>
        </main>
    );
}