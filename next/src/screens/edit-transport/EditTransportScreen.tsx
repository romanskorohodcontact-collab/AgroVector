import { Header } from "@/widgets/header";

interface EditTransportScreenProps {
  params: Promise<{ id: string }>;
}

export async function EditTransportScreen({ params }: EditTransportScreenProps) {
  const { id } = await params;
  return (
    <main>
      <Header />
      <h1>Редактирование заявки на транспорт</h1>
      <p>Заявка: {id}</p>
    </main>
  );
}