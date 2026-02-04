import { clsx } from 'clsx';
import { SchemaCapacityIssue } from '../../../api/types';
import {
    addIgnoredConflict,
    formatStringOrList,
    removeIgnoredConflict,
} from '../../../lib/utils';
import deleteBtn from '../../Delete Icon.svg';
import { LessonBlock } from './LessonBlock';

export function CapacityIssueCard({
  issue,
  onIgnore,
  mode = 'ignore',
}: {
  issue: SchemaCapacityIssue;
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

  const isOverCapacity =
    issue.room_capacity !== null && issue.needed_capacity > issue.room_capacity;

  return (
    <div className="flex flex-col">
      {/* Issue title */}
      <div className="flex justify-between w-full px-2">
        <div className="flex items-center gap-2 mt-1 text-base font-bold">
          Capacity exceeded
        </div>

        <button
          type="button"
          className="rounded-lg p-0.5 size-8 hover:bg-accent shrink-0 h-fit"
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

      {/* Information about capacity */}
      <div
        className={clsx(
          'flex items-center gap-2 mt-1 text-xs w-fit px-2 py-1 rounded-lg font-semibold',
          isOverCapacity ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'
        )}
      >
        {issue.room_capacity !== null
          ? `${issue.needed_capacity}/${issue.room_capacity}`
          : `${issue.needed_capacity} needed`}{' '}
        for room {formatStringOrList(issue.room)}
      </div>

      {/* Related lesson */}
      <LessonBlock lesson={issue.lesson} />
    </div>
  );
}
