import { useState } from 'react';
import {
  formatTimeForMoscow,
  groupNameToDisplayText,
  addIgnoredConflict,
  removeIgnoredConflict,
  collisionTypeToDisplayText,
} from '../../lib/utils';

import { type Conflict } from '../../lib/types';
import { serverFunctions } from '../../lib/serverFunctions';
import selectBtn from '../Search Icon.svg';
import deleteBtn from '../Delete Icon.svg';
import Spinner from './Spinner';

interface LessonCardProps {
  lesson: Conflict;
  onIgnore?: () => void;
  mode?: 'ignore' | 'restore';
}

export default function LessonCard({
  lesson,
  onIgnore,
  mode = 'ignore',
}: LessonCardProps) {
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);
  const timeString = formatTimeForMoscow(lesson.start_time);

  async function selectCell(range: string) {
    setIsGoogleBusy(true);
    await serverFunctions.selectTheRangeForUser(range);
    setIsGoogleBusy(false);
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

  return (
    <div className="bg-dark w-full text-center p-3 rounded-md select-text flex">
      <div className="grow">
        <p className="text-highlight">{lesson.lesson_name}</p>
        {'group_name' in lesson && lesson.group_name !== null && (
          <p title={lesson.group_name.toString()} className="">
            {groupNameToDisplayText(lesson.group_name)}
          </p>
        )}
        <p className="text-highlight" title={lesson.teacher}>
          {lesson.teacher.length > 30
            ? lesson.teacher.slice(0, 30) + '…'
            : lesson.teacher}
        </p>
        <p className="select-text">
          {timeString} - {lesson.room}
        </p>
        <p className="text-sm font-bold">
          {collisionTypeToDisplayText(lesson.collision_type)}
        </p>
      </div>
      <div className="shrink flex flex-col gap-1">
        {'excel_range' in lesson && (
          <button
            disabled={isGoogleBusy}
            className="rounded-lg p-1 w-10 h-10 bg-dark brightness-150 hover:bg-accent transition-colors"
            onClick={() => selectCell(lesson.excel_range)}
            title="Select cell in spreadsheet"
          >
            {isGoogleBusy ? (
              <Spinner />
            ) : (
              <img
                src={selectBtn}
                width={32}
                height={32}
                className="icon-select"
              />
            )}
          </button>
        )}
        <button
          className="rounded-lg p-1 bg-dark brightness-150 hover:bg-accent transition-colors"
          onClick={handleAction}
          title={
            mode === 'ignore' ? 'Ignore this conflict' : 'Restore this conflict'
          }
        >
          <img
            src={deleteBtn}
            width={32}
            height={32}
            alt=""
            className={mode === 'ignore' ? 'icon-ignore' : 'icon-restore'}
          />
        </button>
      </div>
    </div>
  );
}
