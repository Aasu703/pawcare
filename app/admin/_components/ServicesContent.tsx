import { Briefcase } from "lucide-react";

export default function ServicesContent() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                <p className="text-gray-500 mt-1">Manage available pet care services.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Services Content</h2>
                <p className="text-gray-500 mt-2">Add your services management content here.</p>
            </div>
        </div>
    );
}
