import { useState, useCallback, useEffect } from 'react';
import { Conflict } from '../../lib/types';
import {
  getIgnoredConflictIds,
  removeIgnoredConflict,
  getConflictId,
} from '../../lib/utils';
import Card from './LessonCard';
import innohassleSvg from '../innohassle.svg';

interface IgnoredConflictsPageProps {
  onBack: () => void;
  conflicts: Conflict[][];
}

export default function IgnoredConflictsPage({
  onBack,
  conflicts,
}: IgnoredConflictsPageProps) {
  const [ignoredConflicts, setIgnoredConflicts] = useState<Conflict[][]>([]);

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

  return (
    <div className="text-center text-white flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h1>
          InNo<span className="text-innohassle">Hassle</span> SCR
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <h2 className="text-xl font-semibold">Ignored Conflicts</h2>

      {totalIgnored > 0 ? (
        <>
          <p className="text-subtle">Total ignored conflicts: {totalIgnored}</p>

          <div className="flex flex-col gap-3">
            {ignoredConflicts.map((data, index) => (
              <div key={index} className="flex flex-col gap-10">
                {data.map((data2, index2) => (
                  <div key={index * data.length + index2} className="relative">
                    <Card
                      lesson={data2}
                      onIgnore={() => handleRestoreConflict(data2)}
                      mode="restore"
                    />
                  </div>
                ))}
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
        <a href="https://innohassle.ru" target="_blank">
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
