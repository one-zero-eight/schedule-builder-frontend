import { formatTimeForMoscow, groupNameToDisplayText } from "../../lib/utils"

import { type Conflict } from "../../lib/types";
import { collisionTypeToDisplayText } from "../../lib/utils";
import { serverFunctions } from "../../lib/serverFunctions";

export default function LessonCard(slot: Conflict) {
  const timeString = formatTimeForMoscow(slot.start_time)

  return (
    <div className="bg-dark border border-innohassle w-full text-center p-3 rounded-md select-text">
      <p className="text-highlight">{slot.lesson_name}</p>
      {"group_name" in slot && <p title={slot.group_name.toString()} className="">{groupNameToDisplayText(slot.group_name)}</p>}
      <p className="text-highlight">{slot.teacher}</p>
      <p className="select-text">{timeString} - {slot.room}</p>

      <hr className="my-1 border-subtle"/>

      <p className="text-sm font-bold">{collisionTypeToDisplayText(slot.collision_type)}</p>
      {"excel_range" in slot && <button className="border px-6 py-1 select-none" onClick={() => serverFunctions.selectTheRangeForUser(slot.excel_range)}>Select the range</button>}
    </div>
  );
}
