// This is an example card without any meaningful info
import { formatTimeForMoscow } from "../../lib/utils"

import { type LessonSlot } from "../../lib/types";


export default function LessonCard(slot: LessonSlot) {
  const timeString = formatTimeForMoscow(slot.start_time)

  return (
    <div className="bg-dark border border-innohassle w-fit text-center p-3 rounded-md *:select-all">
      <p className="text-highlight">{slot.lesson_name}</p>
      {slot.group_name && <p>{slot.group_name}</p>}
      <p className="text-highlight">{slot.teacher || "No teacher"}</p>
      <p>{timeString} - {slot.room}</p>
    </div>
  );
}
