import { useContext, useState } from 'react';
import { SchemaLesson } from '../../../api/types';
import { serverFunctions } from '../../../lib/serverFunctions';
import { formatDateShort, formatStringOrList, formatTimeForMoscow } from '../../../lib/utils';
import spreadsheetContext from '../../contexts/spreadsheetContext';
import selectBtn from '../../Search Icon.svg';
import { Spinner } from '../Spinner';

export function LessonBlock({ lesson }: { lesson: SchemaLesson }) {
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);
  const currentSpreadsheetId = useContext(spreadsheetContext);

  const isExternalSpreadsheet =
    currentSpreadsheetId != null && lesson.spreadsheet_id !== currentSpreadsheetId;

  function getExternalLink() {
    return `https://docs.google.com/spreadsheets/d/${lesson.spreadsheet_id}?gid=${lesson.google_sheet_gid}#gid=${lesson.google_sheet_gid}&range=${lesson.a1_range}`;
  }

  async function selectCell(sheetName: string | null, range: string) {
    setIsGoogleBusy(true);
    await serverFunctions.selectTheRangeForUser(sheetName, range);
    setIsGoogleBusy(false);
  }

  return (
    <div className="flex text-blue-400 text-sm">
      {lesson.a1_range && (
        isExternalSpreadsheet ? (
          <a
            href={getExternalLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-0.5 size-8 shrink-0 bg-surface hover:bg-accent flex items-center justify-center"
            title={`Open in external spreadsheet (${lesson.a1_range} on '${lesson.google_sheet_name}')`}
          >
            <img
              src={selectBtn}
              width={32}
              height={32}
              className="icon-select"
            />
          </a>
        ) : (
          <button
            type="button"
            className="rounded-lg p-0.5 size-8 shrink-0 bg-surface hover:bg-accent"
            onClick={() =>
              selectCell(lesson.google_sheet_name, lesson.a1_range || '')
            }
            title={`Select cell in spreadsheet (${lesson.a1_range} on '${lesson.google_sheet_name}')`}
          >
            {isGoogleBusy ? (
              <Spinner className="text-primary" />
            ) : (
              <img
                src={selectBtn}
                width={32}
                height={32}
                className="icon-select"
              />
            )}
          </button>
        )
      )}

      <div className="flex grow flex-col overflow-hidden">
        <p>{lesson.lesson_name}</p>
        <p className="text-xs select-text line-clamp-1">
          {lesson.date_on && lesson.date_on.length > 0
            ? lesson.date_on.map(formatDateShort).join(', ')
            : lesson.weekday}
          <span className="inline-block w-3" />
          {formatTimeForMoscow(lesson.start_time)}-
          {formatTimeForMoscow(lesson.end_time)} (
          {formatStringOrList(lesson.room)})
        </p>
        {lesson.group_name && (
          <p
            title={lesson.group_name.toString()}
            className="line-clamp-1 text-xs"
          >
            {typeof lesson.group_name === 'string'
              ? lesson.group_name
              : lesson.group_name.join('/')}
          </p>
        )}
        <p className="text-xs line-clamp-1">{lesson.teacher}</p>
      </div>
    </div>
  );
}
