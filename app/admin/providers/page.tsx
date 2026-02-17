import { DashboardHeader, ProviderAccountsTable, AllProvidersTable, ProvidersTable } from "../_components";

export default function ProvidersPage() {
  return (
    <div>
      <DashboardHeader
        title="Provider Verifications"
        subtitle="Review provider account submissions and service registrations"
      />
      <ProviderAccountsTable />
      <AllProvidersTable />
      <ProvidersTable />
    </div>
  );
}

