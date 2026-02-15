"use client";

import { Suspense } from 'react';
import ResetPasswordForm from "../_components/ResetPasswordForm";
import { useSearchParams } from 'next/navigation';

function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    if(!token){
        throw new Error('Invalid or missing token');
    }

    return (
        <div>
            <ResetPasswordForm token={token} />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
