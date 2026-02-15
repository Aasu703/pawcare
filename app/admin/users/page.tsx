import { DashboardHeader, UsersTable } from "../_components";

export default function UsersPage() {
  return (
    <div>
      <DashboardHeader
        title="Users"
        subtitle="Manage all users in the system"
      />
      <UsersTable />
    </div>
  );
}

