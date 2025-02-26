import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanCard from './KanbanCard';
import KanbanColumnHeader from "./KanbanColumnHeader";
import { ITask, Task } from "@/features/tasks/schema";
import { TASK_STATUS } from "@/features/tasks/constants";

const boards: Array<TASK_STATUS> = [
  TASK_STATUS.BACKLOG,
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.DONE,
];

type TasksState = {
  [key in TASK_STATUS]: Array<ITask>;
};

interface DataKanbanProps {
  data: Task;
}

function DataKanban({ data }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.IN_REVIEW]: [],
      [TASK_STATUS.DONE]: [],
    };

    (data?.documents || []).forEach((task: ITask) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TASK_STATUS].sort(
        (a, b) => (a?.position || 0) - (b?.position || 0)
      );
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id as string}
                        index={index}
                      >
                        {(provided) => (
                          <div
                          ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default DataKanban;
