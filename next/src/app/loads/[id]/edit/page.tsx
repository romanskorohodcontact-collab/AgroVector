import { EditLoadScreen } from "@/screens/edit-load/EditLoadScreen";

export default function EditLoadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditLoadScreen params={params} />;
}