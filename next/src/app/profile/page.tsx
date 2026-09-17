import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ProfileScreen user={user} />;
}