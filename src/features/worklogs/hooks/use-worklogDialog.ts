import { useQueryState, parseAsString } from "nuqs";

export const useWorklogDialog = () => {
  const [taskId, setTaskId] = useQueryState("add-worklog", parseAsString);

  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    taskId,
    open,
    close,
    setTaskId,
    isOpen: !!taskId,
  };
};

