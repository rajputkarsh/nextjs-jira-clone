import { ITask } from "@/features/tasks/schema";

interface DataCalendarProps {
  data: Array<ITask>;
}

function DataCalendar({ data }: DataCalendarProps) {
  return <div>DataCalendar</div>;
}

export default DataCalendar;
