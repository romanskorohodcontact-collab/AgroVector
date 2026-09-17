import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { EditProfileScreen } from "@/screens/edit-profile/EditProfileScreen";

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <EditProfileScreen user={user} />;
}