import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { getOwnLoad } from "@/server/modules/loads";
import { EditLoadScreen } from "@/screens/edit-load/EditLoadScreen";

export default async function EditLoadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const load = await getOwnLoad(id, user.id);
  if (!load) redirect("/");
  return <EditLoadScreen load={load} />;
}