// This is an example card without any meaningful info
import { formatTimeForMoscow } from "../../lib/utils"

import { LessonSlotWithCollision, type LessonSlot } from "../../lib/types";
import { collisionTypeToDisplayText } from "../../lib/utils";
import { serverFunctions } from "../../lib/serverFunctions";

export default function LessonCard(slot: LessonSlot | LessonSlotWithCollision) {
  const timeString = formatTimeForMoscow(slot.start_time)

  const hasCollision = "collision_type" in slot

  return (
    <div className="bg-dark border border-innohassle w-full text-center p-3 rounded-md">
      <p className="text-highlight select-all">{slot.lesson_name}</p>
      {slot.group_name && <p className="select-all">{slot.group_name}</p>}
      <p className="text-highlight select-all">{slot.teacher || "No teacher"}</p>
      <p className="select-text">{timeString} - {slot.room}</p>

      <hr className="my-1 border-subtle"/>

      {hasCollision && <p className="text-sm font-bold">{collisionTypeToDisplayText(slot.collision_type)}</p>}
      <button className="border px-6 py-1 select-none" onClick={() => serverFunctions.selectTheRangeForUser(slot.excel_range)}>Select the range</button>
    </div>
  );
}
