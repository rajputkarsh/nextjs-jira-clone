import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TASK_STATUS } from "../constants";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TASK_STATUS)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
