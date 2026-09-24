import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { CreateTransportScreen } from "@/screens/create-transport/CreateTransportScreen";

export default async function CreateTransportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <CreateTransportScreen user={user} />;
}