import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/modules/auth";
import { RegisterScreen } from "@/screens/register/RegisterScreen";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile");
  return <RegisterScreen />;
}