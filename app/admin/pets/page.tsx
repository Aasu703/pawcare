import { DashboardHeader, PetsTable } from "../_components";

export default function PetsPage() {
  return (
    <div>
      <DashboardHeader
        title="Pets"
        subtitle="Manage all pets in the system"
      />
      <PetsTable />
    </div>
  );
}
