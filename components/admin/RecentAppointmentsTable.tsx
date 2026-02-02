interface Appointment {
    pet: string;
    owner: string;
    service: string;
    time: string;
    status: "Completed" | "In Progress" | "Scheduled";
}

const statusColors = {
    "Completed": "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Scheduled": "bg-orange-100 text-orange-700",
};

export default function RecentAppointmentsTable() {
    const appointments: Appointment[] = [
        { pet: "Max", owner: "John Smith", service: "Grooming", time: "09:00 AM", status: "Completed" },
        { pet: "Bella", owner: "Sarah Johnson", service: "Checkup", time: "10:30 AM", status: "In Progress" },
        { pet: "Charlie", owner: "Mike Brown", service: "Vaccination", time: "11:00 AM", status: "Scheduled" },
        { pet: "Luna", owner: "Emily Davis", service: "Dental", time: "02:00 PM", status: "Scheduled" },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Pet</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Owner</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Service</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Time</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt, index) => (
                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-orange-600 font-medium">{apt.pet}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{apt.owner}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{apt.service}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{apt.time}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                                        {apt.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
