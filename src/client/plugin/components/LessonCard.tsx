// This is an example card without any meaningful info
import { formatTimeForMoscow } from "../../lib/utils"

interface LessonCardProps {
  teacher: string,
  group_name: string | null,
  room: string,
  start: string
}

export default function LessonCard(props: LessonCardProps) {
  const timeString = formatTimeForMoscow(props.start)

  return (
    <div className="bg-dark border border-innohassle w-fit text-center p-3 rounded-md *:select-all">
      <p className="text-highlight">Backend forgot to send lesson name ;)</p>
      {props.group_name && <p>{props.group_name}</p>}
      <p className="text-highlight">{props.teacher || "No teacher"}</p>
      <p>{timeString} - {props.room}</p>
    </div>
  );
}
