import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { EditTransportScreen } from "@/screens/edit-transport/EditTransportScreen";

export default async function EditTransportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <EditTransportScreen params={params} />;
}