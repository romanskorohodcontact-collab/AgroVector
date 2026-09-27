import { CreateThreadForm } from "@/features/create-thread/CreateThreadForm";

export function ForumNewTopicScreen() {
  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-[26px] font-medium leading-[1.5] tracking-[-0.52px] text-text-primary">
          Создать тему!
        </h1>
        <p className="mt-2 text-lg leading-[1.78] tracking-[-0.18px] text-text-secondary">
          Опишите вопрос или идею — другие участники смогут ответить после
          публикации.
        </p>
      </div>

      <div className="mt-6">
        <CreateThreadForm />
      </div>
    </div>
  );
}
