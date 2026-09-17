import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { LoginScreen } from "@/screens/login/LoginScreen";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile");
  return <LoginScreen />;
}