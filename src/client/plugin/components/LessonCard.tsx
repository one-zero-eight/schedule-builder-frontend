import { formatTimeForMoscow, groupNameToDisplayText, addIgnoredConflict, removeIgnoredConflict } from "../../lib/utils"

import { type Conflict } from "../../lib/types";
import { collisionTypeToDisplayText } from "../../lib/utils";
import { serverFunctions } from "../../lib/serverFunctions";
import selectBtn from "../selectBtn.png"
import deleteBtn from "../deleteBtn.png"
import { useState } from "react";
import Spinner from "./Spinner";

interface LessonCardProps {
  lesson: Conflict;
  onIgnore?: () => void;
  mode?: 'ignore' | 'restore';
}

export default function LessonCard({ lesson, onIgnore, mode = 'ignore' }: LessonCardProps) {
  const [isGoogleBusy, setIsGoogleBusy] = useState(false)
  const timeString = formatTimeForMoscow(lesson.start_time)

  async function selectCell(range: string) {
    setIsGoogleBusy(true)
    await serverFunctions.selectTheRangeForUser(range)
    setIsGoogleBusy(false)
  }

  const handleAction = () => {
    if (mode === 'ignore') {
      addIgnoredConflict(lesson);
    } else {
      removeIgnoredConflict(lesson);
    }
    
    if (onIgnore) {
      onIgnore();
    }
  };

  const isRestoreMode = mode === 'restore';
  const buttonClass = isRestoreMode 
    ? "text-[10px] w-4 h-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors absolute top-1 right-1 flex items-center justify-center"
    : "text-[10px] w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors absolute top-1 right-1 flex items-center justify-center";
  
  const buttonTitle = isRestoreMode ? "Restore this conflict" : "Ignore this conflict";
  const buttonText = isRestoreMode ? "↻" : "×";

  return (
    <div className="bg-dark w-full text-center p-3 rounded-md select-text flex">
        {/* <button
            onClick={handleAction}
            className={buttonClass}
            title={buttonTitle}
          >
            {buttonText}
          </button> */}
      <div className="grow">
        <p className="text-highlight">{lesson.lesson_name}</p>
        {("group_name" in lesson && lesson.group_name !== null) && <p title={lesson.group_name.toString()} className="">{groupNameToDisplayText(lesson.group_name)}</p>}
        <p className="text-highlight">{lesson.teacher}</p>
        <p className="select-text">{timeString} - {lesson.room}</p>
        <p className="text-sm font-bold">{collisionTypeToDisplayText(lesson.collision_type)}</p>
      </div>
      <div className="shrink flex flex-col gap-1">
        {"excel_range" in lesson && (
          <button disabled={isGoogleBusy} className="rounded-lg p-1 w-10 h-10 bg-dark brightness-150" onClick={() => selectCell(lesson.excel_range)}>
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
