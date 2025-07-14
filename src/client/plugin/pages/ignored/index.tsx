import { useState, useCallback, useEffect } from 'react';
import { Conflict } from '../../../lib/types';
import {
  getIgnoredConflictIds,
  removeIgnoredConflict,
  getConflictId,
} from '../../../lib/utils';
import Card from '../../components/LessonCard';
import innohassleSvg from '../../innohassle.svg';

import { INNOHASSLE_URL } from '../../../lib/constants';
import useConflicts from '../../hooks/useConflicts';

export default function IgnoredConflictsPage() {
  const [ignoredConflicts, setIgnoredConflicts] = useState<Conflict[][]>([]);

  const da = useConflicts();
  const conflicts = da.conflicts.payload;

  // Получаем игнорируемые конфликты
  const getIgnoredConflicts = useCallback(() => {
    const ignoredIds = getIgnoredConflictIds();
    const ignored: Conflict[][] = [];

    conflicts.forEach((conflictGroup) => {
      const ignoredGroup = conflictGroup.filter((conflict) => {
        const conflictId = getConflictId(conflict);
        return ignoredIds.includes(conflictId);
      });
      if (ignoredGroup.length > 0) {
        ignored.push(ignoredGroup);
      }
    });

    return ignored;
  }, [conflicts]);

  // Обработчик для восстановления конфликта
  const handleRestoreConflict = useCallback(
    (conflict: Conflict) => {
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

  const totalIgnored = ignoredConflicts.reduce(
    (total, group) => total + group.length,
    0
  );

  // Группируем игнорируемые конфликты по курсам, сохраняя структуру групп
  const groupIgnoredConflictsByCourse = (conflicts: Conflict[][]) => {
    const coursesByConflict: { [key: string]: Conflict[][] } = {};
    
    conflicts.forEach((conflictGroup) => {
      // Создаем множество уникальных курсов для этой группы конфликтов
      const coursesInGroup = new Set<string>();
      
      conflictGroup.forEach((conflict) => {
        const courseName = conflict.lesson_name
          .replace("(tut)", "")
          .replace(/\(lec\)/g, "")
          .replace(/\(lab\)/g, "")
          .trim();
        coursesInGroup.add(courseName);
      });
      
      // Добавляем эту группу конфликтов в каждый соответствующий курс
      coursesInGroup.forEach((courseName) => {
        if (!coursesByConflict[courseName]) {
          coursesByConflict[courseName] = [];
        }
        coursesByConflict[courseName].push(conflictGroup);
      });
    });
    
    return coursesByConflict;
  };

  const ignoredUnits = groupIgnoredConflictsByCourse(ignoredConflicts);

  return (
    <div className="text-center text-white flex flex-col gap-3 h-full">
      <h2 className="text-xl font-semibold">Ignored Conflicts</h2>

      {totalIgnored > 0 ? (
        <>
          <p className="text-subtle">Total ignored conflicts: {totalIgnored}</p>

          <div className="flex flex-col gap-3">
            {Object.entries(ignoredUnits).map(([courseName, courseConflictGroups]) => (
              <div key={courseName} className="flex flex-col gap-3">
                <h4 className="font-semibold text-lg text-highlight border-b border-highlight pb-2">
                  {courseName}
                </h4>
                <div className="flex flex-col gap-3">
                  {courseConflictGroups.map((conflictGroup, groupIndex) => (
                    <div key={`${courseName}-group-${groupIndex}`} className="flex flex-col gap-2">
                      {conflictGroup.map((conflict, conflictIndex) => (
                        <div key={`${courseName}-group-${groupIndex}-conflict-${conflictIndex}`} className="relative">
                          <Card
                            lesson={conflict}
                            onIgnore={() => handleRestoreConflict(conflict)}
                            mode="restore"
                          />
                        </div>
                      ))}
                      {groupIndex < courseConflictGroups.length - 1 && (
                        <hr className="py-2 border-highlight" />
                      )}
                    </div>
                  ))}
                </div>
                <hr className="py-2 border-highlight" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-subtle text-lg">No ignored conflicts</p>
          <p className="text-subtle text-sm mt-2">
            All ignored conflicts will appear here
          </p>
        </div>
      )}

      <footer className="flex flex-col items-center mt-auto select-none">
        <a href={INNOHASSLE_URL} target="_blank">
          <img
            src={innohassleSvg}
            width={48}
            height={48}
            alt="innohassle-logo"
          />
        </a>
        <p className="mt-2">Schedule conflict resolver</p>
        <p>
          Project created for{' '}
          <span className="text-innohassle">Software Project 2025</span> course
        </p>
        <p className="mt-2 text-subtle">
          Copyright © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
