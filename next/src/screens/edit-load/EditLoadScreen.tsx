import { Header } from "@/widgets/header";

interface EditLoadScreenProps {
  params: Promise<{ id: string }>;
}

export async function EditLoadScreen({ params }: EditLoadScreenProps) {
  const { id } = await params;
  return (
    <main>
      <Header />
      <h1>Редактирование заявки на груз</h1>
      <p>Заявка: {id}</p>
    </main>
  );
}