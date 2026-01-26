import { exampleAction } from "@/lib/actions/example-action";
import { notFound } from "next/navigation";

export default async function Page() {
    const result = await exampleAction();

    if(!result.success){
        return notFound();
    }
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Server Action Result</h1>
                {result.success ? (
                    <div className="text-green-600">
                        <p>{result.message}</p>
                    </div>
                ) : (
                    <div className="text-red-600">
                        <p>Action failed. Please try again.</p>
                    </div>
                )}
            </div>
        </main>
    );
}