import { DashboardHeader } from "../../_components";
import UserDetail from "../../_components/UserDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <DashboardHeader
        title="User Details"
        subtitle="View detailed information about this user"
      />
      <UserDetail userId={id} />
    </div>
  );
}