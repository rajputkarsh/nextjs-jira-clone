import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl";

function TaskViewSwitcher() {
  const translations = useTranslations("TaskViewSwitcher");

  return (
    <Tabs className="flex-1 w-full rounded-lg">
    </Tabs>
  );
}

export default TaskViewSwitcher