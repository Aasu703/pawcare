import { DashboardHeader, ProvidersTable } from "../_components";

export default function ProvidersPage() {
  return (
    <div>
      <DashboardHeader
        title="Service Providers"
        subtitle="Manage all service providers in the system"
      />
      <ProvidersTable />
    </div>
  );
}
