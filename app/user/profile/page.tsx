import { handlewhoAmI } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";
import { getAuthToken } from "@/lib/cookie";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    // Debug: Check if token exists
    const token = await getAuthToken();
    console.log('[ProfilePage] Token exists:', !!token);
    
    const result = await handlewhoAmI();

    if (!result.success) {
        throw new Error("Error fetching user data");
    }
    if (!result.data) {
        notFound();
    }
    return (
        <div>
            <UpdateUserForm user={result.data} />
        </div>
    );
}
