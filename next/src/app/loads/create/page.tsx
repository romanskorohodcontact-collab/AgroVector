import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { CreateLoadScreen } from "@/screens/create-load/CreateLoadScreen";

export default async function CreateLoadPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <CreateLoadScreen user={user} />;
}