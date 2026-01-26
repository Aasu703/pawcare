import { handlewhoAmI } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import UpdateForm from "./_components/UpdateForm";

export default async function ProfilePage() {
    const result = await handlewhoAmI();
    if(!result.success){
        return notFound();
    }
    const user = result.data;
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <UpdateForm user={result.data} />
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                <div className="text-gray-700">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
        </main>
    );
}
