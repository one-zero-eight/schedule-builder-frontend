import { formatTimeForMoscow, groupNameToDisplayText } from "../../lib/utils"

import { type Conflict } from "../../lib/types";
import { collisionTypeToDisplayText } from "../../lib/utils";
import { serverFunctions } from "../../lib/serverFunctions";
import selectBtn from "../selectBtn.png"
import deleteBtn from "../deleteBtn.png"
import { useState } from "react";
import Spinner from "./Spinner";

export default function LessonCard(slot: Conflict) {
  const [isGoogleBusy, setIsGoogleBusy] = useState(false)

  async function selectCell(range: string) {
    setIsGoogleBusy(true)
    await serverFunctions.selectTheRangeForUser(range)
    setIsGoogleBusy(false)
  }

  const timeString = formatTimeForMoscow(slot.start_time)

  return (
    <div className="bg-dark w-full text-center p-3 rounded-md select-text flex">
      <div className="grow">
        <p className="text-highlight">{slot.lesson_name}</p>
        {"group_name" in slot && <p title={slot.group_name.toString()} className="">{groupNameToDisplayText(slot.group_name)}</p>}
        <p className="text-highlight">{slot.teacher}</p>
        <p className="select-text">{timeString} - {slot.room}</p>
        <p className="text-sm font-bold">{collisionTypeToDisplayText(slot.collision_type)}</p>
      </div>
      <div className="shrink flex flex-col gap-1">
        {"excel_range" in slot && (
          <button disabled={isGoogleBusy} className="rounded-lg p-1 w-10 h-10 bg-dark brightness-150" onClick={() => selectCell(slot.excel_range)}>
            {isGoogleBusy ? <Spinner /> : <img src={selectBtn} width={32} height={32}/>}
          </button>
        )}
        <button className="rounded-lg p-1 bg-dark brightness-150" onClick={() => alert("Button is in development")}>
          <img src={deleteBtn} width={32} height={32} alt="" />
        </button>
      </div>
    </div>
  );
}
