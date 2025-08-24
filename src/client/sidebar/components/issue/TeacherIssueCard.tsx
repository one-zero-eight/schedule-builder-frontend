import { SchemaTeacherIssue } from '../../../api/types';
import { addIgnoredConflict, removeIgnoredConflict } from '../../../lib/utils';
import deleteBtn from '../../Delete Icon.svg';
import { LessonBlock } from './LessonBlock';

export function TeacherIssueCard({
  issue,
  onIgnore,
  mode = 'ignore',
}: {
  issue: SchemaTeacherIssue;
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
          The teacher {issue.teacher} is busy
        </div>

        <button
          type="button"
          className="rounded-lg p-0.5 size-8 hover:bg-accent shrink-0 h-fit cursor-pointer"
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

      {/* List of teaching lessons */}
      <div className="text-xs text-gray-400 mt-1">
        {issue.teaching_lessons.length > 0 && (
          <div>
            Teaching: {issue.teaching_lessons.length} lesson
            {issue.teaching_lessons.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      {issue.teaching_lessons.map((lesson, index) => (
        <LessonBlock key={index} lesson={lesson} />
      ))}

      {/* List of studying lessons */}
      <div>
        {issue.studying_lessons.length > 0 && (
          <div>
            Studying: {issue.studying_lessons.length} lesson
            {issue.studying_lessons.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      {issue.studying_lessons.map((lesson, index) => (
        <LessonBlock key={index} lesson={lesson} />
      ))}
    </div>
  );
}
