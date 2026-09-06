import { EditTransportScreen } from "@/screens/edit-transport/EditTransportScreen";

export default function EditTransportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditTransportScreen params={params} />;
}