import Link from "next/link";


export default async function Page() {
    return (
        <div>
            <Link className="text-blue-500 underline" href="/admin/users/list">Go to User List Page</Link>
        </div>
    )
}