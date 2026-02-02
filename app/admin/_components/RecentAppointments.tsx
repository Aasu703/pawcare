import { Calendar } from "lucide-react";

interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  service: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface RecentAppointmentsProps {
  appointments?: Appointment[];
}

const defaultAppointments: Appointment[] = [
  {
    id: "1",
    petName: "Max",
    ownerName: "John Smith",
    service: "Grooming",
    time: "9:00 AM",
    status: "scheduled",
  },
  {
    id: "2",
    petName: "Bella",
    ownerName: "Sarah Johnson",
    service: "Checkup",
    time: "10:30 AM",
    status: "completed",
  },
  {
    id: "3",
    petName: "Charlie",
    ownerName: "Mike Davis",
    service: "Vaccination",
    time: "11:00 AM",
    status: "scheduled",
  },
  {
    id: "4",
    petName: "Luna",
    ownerName: "Emily Brown",
    service: "Dental Cleaning",
    time: "2:00 PM",
    status: "scheduled",
  },
  {
    id: "5",
    petName: "Cooper",
    ownerName: "David Wilson",
    service: "Surgery",
    time: "3:30 PM",
    status: "cancelled",
  },
];

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export default function RecentAppointments({
  appointments = defaultAppointments,
}: RecentAppointmentsProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Appointments</h3>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="pb-3 font-medium">Pet</th>
              <th className="pb-3 font-medium">Owner</th>
              <th className="pb-3 font-medium">Service</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b last:border-0">
                <td className="py-4 font-medium">{appointment.petName}</td>
                <td className="py-4 text-muted-foreground">
                  {appointment.ownerName}
                </td>
                <td className="py-4">{appointment.service}</td>
                <td className="py-4 text-muted-foreground">
                  {appointment.time}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[appointment.status]}`}
                  >
                    {appointment.status}
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
