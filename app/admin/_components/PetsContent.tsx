import { PawPrint } from "lucide-react";

export default function PetsContent() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
                <p className="text-gray-500 mt-1">Manage all registered pets in the system.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Pets Content</h2>
                <p className="text-gray-500 mt-2">Add your pets management content here.</p>
            </div>
        </div>
    );
}
