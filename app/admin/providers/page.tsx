import { DashboardHeader, ProvidersTable } from "../_components";

export default function ProvidersPage() {
  return (
    <div>
      <DashboardHeader
        title="Provider Service Verifications"
        subtitle="Review and approve provider service registrations"
      />
      <ProvidersTable />
    </div>
  );
}
