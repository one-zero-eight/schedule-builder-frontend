import { useState } from 'react';
import { SchemaLessonWithExcelCellsDto } from '../../../api/types';
import { serverFunctions } from '../../../lib/serverFunctions';
import { formatStringOrList, formatTimeForMoscow } from '../../../lib/utils';
import selectBtn from '../../Search Icon.svg';
import Spinner from '../Spinner';

export function LessonBlock({
  lesson,
}: {
  lesson: SchemaLessonWithExcelCellsDto;
}) {
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);

  async function selectCell(sheetName: string | null, range: string) {
    setIsGoogleBusy(true);
    await serverFunctions.selectTheRangeForUser(sheetName, range);
    setIsGoogleBusy(false);
  }

  return (
    <div className="flex text-blue-400 text-sm">
      {lesson.excel_range && (
        <button
          type="button"
          className="rounded-lg p-0.5 size-8 shrink-0 bg-surface hover:bg-accent transition-colors cursor-pointer"
          onClick={() =>
            selectCell(lesson.excel_sheet_name, lesson.excel_range || '')
          }
          title={`Select cell in spreadsheet (${lesson.excel_range} on '${lesson.excel_sheet_name}')`}
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

      <div className="flex grow flex-col overflow-hidden">
        <p>{lesson.lesson_name}</p>
        <p className="text-xs select-text line-clamp-1">
          {lesson.weekday} {formatTimeForMoscow(lesson.start_time)}-
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
