import { SchemaOutlookIssue } from '../../../api/types';
import { addIgnoredConflict, formatStringOrList, removeIgnoredConflict, } from '../../../lib/utils';
import deleteBtn from '../../Delete Icon.svg';
import { LessonBlock } from './LessonBlock';

export function OutlookIssueCard({
  issue,
  onIgnore,
  mode = 'ignore',
}: {
  issue: SchemaOutlookIssue;
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
          The room{' '}
          {formatStringOrList(issue.outlook_info.map((o) => o.room_id))} is
          booked in Outlook
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

      {/* Related lesson */}
      {issue.lessons.map((lesson, index) => (
        <LessonBlock key={index} lesson={lesson} />
      ))}

      {/* Bookings from Outlook */}
      <div className="overflow-x-auto flex gap-2 grow max-w-full">
        {issue.outlook_info.map((info) => (
          <div
            key={info.event_id}
            className="border border-gray-300 rounded-md py-1 px-2 shrink-0"
          >
            <p>{info.title}</p>
            <p>
              {new Date(info.start_time).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              })}{' '}
              -{' '}
              {new Date(info.end_time).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
