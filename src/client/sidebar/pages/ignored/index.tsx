import { useCallback, useEffect, useState } from 'react';
import { SchemaIssue } from '../../../api/types';
import {
  getIgnoredIssuesIds,
  getIssueId,
  removeIgnoredConflict,
} from '../../../lib/utils';
import { IssueCard } from '../../components/issue/IssueCard';
import useConflicts from '../../hooks/useConflicts';

export function IgnoredConflictsPage() {
  const [ignoredConflicts, setIgnoredConflicts] = useState<SchemaIssue[]>([]);

  const da = useConflicts();
  const conflicts = da.issues.payload;

  // Получаем игнорируемые конфликты
  const getIgnoredConflicts = useCallback(() => {
    const ignoredIds = getIgnoredIssuesIds();

    return conflicts.filter((conflict) => {
      const conflictId = getIssueId(conflict);
      return ignoredIds.includes(conflictId);
    });
  }, [conflicts]);

  // Обработчик для восстановления конфликта
  const handleRestoreConflict = useCallback(
    (conflict: SchemaIssue) => {
      removeIgnoredConflict(conflict);
      // Обновляем состояние для перерендера
      setIgnoredConflicts(getIgnoredConflicts());
    },
    [getIgnoredConflicts]
  );

  // Получаем игнорируемые конфликты при монтировании
  useEffect(() => {
    setIgnoredConflicts(getIgnoredConflicts());
  }, [getIgnoredConflicts]);

  const totalIgnored = ignoredConflicts.length;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-center">Ignored Conflicts</h2>

      {totalIgnored > 0 ? (
        <>
          <p className="text-textSecondary">
            Total ignored conflicts: {totalIgnored}
          </p>

          <div className="flex flex-col gap-3">
            {ignoredConflicts.map((issue, index) => (
              <IssueCard
                key={index}
                issue={issue}
                onIgnore={() => handleRestoreConflict(issue)}
                mode="restore"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-textSecondary text-lg">No ignored conflicts</p>
          <p className="text-textSecondary text-sm mt-2">
            All ignored conflicts will appear here
          </p>
        </div>
      )}
    </div>
  );
}
