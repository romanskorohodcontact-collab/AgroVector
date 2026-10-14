import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { getOwnTransport } from "@/server/modules/transports";
import { EditTransportScreen } from "@/screens/edit-transport/EditTransportScreen";

export default async function EditTransportPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const transport = await getOwnTransport(id, user.id);
  if (!transport) redirect("/");
  return <EditTransportScreen transport={transport} />;
}
