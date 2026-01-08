import { useQueryState, parseAsString } from "nuqs";

export const useEditWorklogDialog = () => {
  const [worklogId, setWorklogId] = useQueryState("edit-worklog", parseAsString);

  const open = (id: string) => setWorklogId(id);
  const close = () => setWorklogId(null);

  return {
    worklogId,
    open,
    isOpen: !!worklogId,
    close,
    setWorklogId,
  };
};
