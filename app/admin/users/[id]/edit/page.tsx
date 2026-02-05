import { DashboardHeader } from "../../../_components";
import UserEditForm from "../../../_components/UserEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <DashboardHeader
        title="Edit User"
        subtitle="Update user information"
      />
      <UserEditForm userId={id} />
    </div>
  );
}