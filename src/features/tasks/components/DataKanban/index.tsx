import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanCard from "./KanbanCard";
import KanbanColumnHeader from "./KanbanColumnHeader";
import { ITask, Task, TaskStatus } from "@/features/tasks/schema";
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
  onChange: (
    tasks: Array<{ $id: string; status: TaskStatus; position: number }>
  ) => void;
}

function DataKanban({ data, onChange }: DataKanbanProps) {
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

  useEffect(() => {
    const newTasks: TasksState = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.IN_REVIEW]: [],
      [TASK_STATUS.DONE]: [],
    };

    (data?.documents || []).forEach((task: ITask) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TASK_STATUS].sort(
        (a, b) => (a?.position || 0) - (b?.position || 0)
      );
    });

    setTasks(newTasks);
  }, [data?.total]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;

      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatePayload: Array<{
        $id: string;
        status: TaskStatus;
        position: number;
      }> = [];

      setTasks((prev) => {
        const newTasks = { ...prev };

        // remove the task from source column;
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        // if there is no moved task, return previous state
        if (!movedTask) return prev;

        // create new task status with updated status
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        // update source column
        newTasks[sourceStatus] = sourceColumn;

        // update destination column
        const destinationColumn = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destinationColumn;

        // api call
        updatePayload = [];
        updatePayload.push({
          $id: updatedMovedTask.$id as string,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        // update position for destination column
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task?.$id !== updatedMovedTask?.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);

            if (task.position !== newPosition) {
              updatePayload.push({
                $id: task.$id as string,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (task.position !== newPosition) {
                updatePayload.push({
                  $id: task.$id as string,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatePayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                    {provided.placeholder}
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
