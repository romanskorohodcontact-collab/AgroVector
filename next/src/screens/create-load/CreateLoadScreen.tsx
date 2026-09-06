import { CreateLoadForm } from "@/features/create-load";
import { Header } from "@/widgets/header";

export function CreateLoadScreen() {
  return (
    <main>
      <Header />
      <h1 style={{ textAlign: "center", margin: "24px 0 0" }}>
        Создание заявки на груз
      </h1>
      <CreateLoadForm />
    </main>
  );
}