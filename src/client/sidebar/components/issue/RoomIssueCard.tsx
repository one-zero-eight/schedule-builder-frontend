import { SchemaRoomIssue } from '../../../api/types';
import {
  addIgnoredConflict,
  formatStringOrList,
  removeIgnoredConflict,
} from '../../../lib/utils';
import deleteBtn from '../../Delete Icon.svg';
import { LessonBlock } from './LessonBlock';

export function RoomIssueCard({
  issue,
  onIgnore,
  mode = 'ignore',
}: {
  issue: SchemaRoomIssue;
  onIgnore?: () => void;
  mode?: 'ignore' | 'restore';
}) {
  const handleAction = () => {
    if (mode === 'ignore') {
      addIgnoredConflict(issue);
    } else {
      removeIgnoredConflict(issue);
    }

    if (onIgnore) {
      onIgnore();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Issue title */}
      <div className="flex justify-between w-full px-2">
        <div className="flex items-center gap-2 mt-1 text-base font-bold">
          The room {formatStringOrList(issue.room)} is taken
        </div>

        <button
          type="button"
          className="rounded-lg p-0.5 size-8 hover:bg-accent transition-colors shrink-0 h-fit cursor-pointer"
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

      {/* Overlapping lessons */}
      {issue.lessons.map((lesson, index) => (
        <LessonBlock key={index} lesson={lesson} />
      ))}
    </div>
  );
}
