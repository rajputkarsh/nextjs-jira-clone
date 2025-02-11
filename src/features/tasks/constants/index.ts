
export enum TASK_STATUS {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
};

export const TASK_STATUS_OBJECT: Record<TASK_STATUS, { key: TASK_STATUS; message: string }> = {
  [TASK_STATUS.BACKLOG]: {
    key: TASK_STATUS.BACKLOG,
    message: "Backlog"
  },
  [TASK_STATUS.TODO]: {
    key: TASK_STATUS.TODO,
    message: "To-Do"
  },
  [TASK_STATUS.IN_PROGRESS]: {
    key: TASK_STATUS.IN_PROGRESS,
    message: "In Progress"
  },
  [TASK_STATUS.IN_REVIEW]: {
    key: TASK_STATUS.IN_REVIEW,
    message: "In Review"
  },
  [TASK_STATUS.DONE]: {
    key: TASK_STATUS.DONE,
    message: "Done"
  },
};