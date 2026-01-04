"use client";

import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
    return (
        <div className="space-y-6 w-full text-white">
             <div className="text-center">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="mt-1 text-sm text-amber-300/80">Log in to your account</p>
            </div>
            <LoginForm />

        </div>
    );
}
