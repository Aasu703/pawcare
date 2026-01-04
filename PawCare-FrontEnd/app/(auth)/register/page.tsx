"use client";

import RegisterForm from "../_components/RegisterForm";


export default function RegisterPage() {
	return (
		<div className="space-y-6 w-full text-white">
			<div className="text-center">
				<h1 className="text-2xl font-semibold">Create an account</h1>
				<p className="mt-1 text-sm text-amber-300/80">Sign up to continue</p>
			</div>
			<RegisterForm />
		</div>
	);
}
