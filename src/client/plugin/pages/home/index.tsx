import { useCallback, useState } from 'react';
import { CollisionType, ConflictResponse } from '../../../lib/types';
import APIForm from '../../components/apiToken/Form';
import ErrorText from '../../components/ErrorText';
import LoadingButton from '../../components/LoadingButton';
import Header from './Header';

import {
  filterIgnoredConflicts,
  getIgnoredConflictIds,
  getLengthOf2DArray,
} from '../../../lib/utils';
import {
  filterConflicts,
  getActiveFilterLabel,
  getFilterOptions,
} from '../../../utils/filterUtils';
import Link from '../../components/router/Link';
import Card from '../../components/LessonCard';
import { INNOHASSLE_URL } from '../../../lib/constants';
import innohassleSvg from '../../innohassle.svg';
import useConflicts from '../../hooks/useConflicts';
import NoConflicts from '../../components/NoConflicts';
import { groupConflictsByCourse } from '../../../utils/unitByCourse';

export default function Home() {
  const { conflicts: payload, updateConflicts } = useConflicts();
  const { payload: conflicts, error, isLoading, step } = payload;

  const [activeFilter, setActiveFilter] = useState<CollisionType | 'all'>(
    'all'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ignoredConflicts, setIgnoredConflicts] = useState<ConflictResponse>(
    []
  );

  // Фильтруем игнорируемые конфликты
  const visibleConflicts = filterIgnoredConflicts(conflicts);

  const totalIssues = getLengthOf2DArray(visibleConflicts);
  const filterOptions = getFilterOptions(visibleConflicts);
  const filteredConflicts = filterConflicts(visibleConflicts, activeFilter);
  const filteredTotalIssues = getLengthOf2DArray(filteredConflicts);
  const currentYear = new Date().getFullYear();

  // Проверяем, есть ли игнорируемые конфликты
  const hasIgnoredConflicts = getIgnoredConflictIds().length > 0;

  // Обработчик для игнорирования конфликта
  const handleIgnoreConflict = useCallback(() => {
    // Обновляем состояние, чтобы перерендерить компонент
    setIgnoredConflicts([...ignoredConflicts]);
  }, [ignoredConflicts]);

  const units = groupConflictsByCourse(filteredConflicts);
  return (
    <>
      <Header />
      <APIForm />
      <LoadingButton
        className="bg-primary disabled:opacity-50 text-base py-1 px-6 text-center rounded-full hover:brightness-75 disabled:hover:brightness-100 flex items-center justify-center gap-2 text-white"
        disabled={isLoading}
        onClick={() => updateConflicts()}
        loadingText={step}
        isLoading={isLoading}
      >
        Check the schedule
      </LoadingButton>
      <ErrorText>{error}</ErrorText>

      {totalIssues > 0 && (
        <>
          <h3 className="font-semibold">Number of issues: {totalIssues}</h3>

          {/* Custom Filter Selector */}
          <div className="flex justify-center gap-4 items-center">
            <div className="relative">
              <div className="p-0.5 bg-primary rounded-lg">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-4 bg-surface rounded-[calc(0.5rem-1px)] text-left min-w-[200px] flex justify-between items-center hover:bg-accent transition-all text-text filter-button"
                >
                  <span>
                    {getActiveFilterLabel(activeFilter, filterOptions)} ({' '}
                    {filteredTotalIssues} )
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 p-0.5 bg-primary rounded-lg z-10">
                  <div className="bg-surface rounded-[calc(0.5rem-1px)] overflow-hidden border border-border">
                    {filterOptions.map(
                      (option) =>
                        Number(option.count) > 0 && (
                          <button
                            key={option.value}
                            onClick={() => {
                              setActiveFilter(
                                option.value as CollisionType | 'all'
                              );
                              setIsDropdownOpen(false);
                            }}
                            className={`filter-option w-full px-4 py-3 text-left ${
                              activeFilter === option.value
                                ? 'active'
                                : 'text-text'
                            }`}
                          >
                            {option.label} ({option.count})
                          </button>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeFilter !== 'all' && (
            <p className="text-sm text-subtle">
              Showing {filteredTotalIssues} of {totalIssues} issues
            </p>
          )}

          {hasIgnoredConflicts && (
            <Link
              className="border-none text-sm text-textSecondary hover:text-text transition-colors"
              href="/ignored"
            >
              Show Ignored Conflicts
            </Link>
          )}
        </>
      )}

      <div className="flex flex-col gap-3 ">
        {totalIssues == 0 ? (
          <NoConflicts />
        ) : (
          Object.entries(units).map(([courseName, courseConflictGroups]) => (
            <div key={courseName} className="flex flex-col gap-3">
              <h4 className="font-semibold text-lg text-highlight border-b border-highlight pb-2">
                {courseName}
              </h4>
              <div className="flex flex-col gap-3">
                {courseConflictGroups.map((conflictGroup, groupIndex) => (
                  <div
                    key={`${courseName}-group-${groupIndex}`}
                    className="flex flex-col gap-2"
                  >
                    {conflictGroup.map((conflict, conflictIndex) => (
                      <Card
                        key={`${courseName}-group-${groupIndex}-conflict-${conflictIndex}`}
                        onIgnore={handleIgnoreConflict}
                        lesson={conflict}
                        mode="ignore"
                      />
                    ))}
                    {groupIndex < courseConflictGroups.length - 1 && (
                      <hr className="py-2 border-highlight" />
                    )}
                  </div>
                ))}
              </div>
              <hr className="py-2 border-highlight" />
            </div>
          ))
        )}
      </div>

      {totalIssues > 0 && filteredTotalIssues === 0 && (
        <p className="text-subtle text-center py-4">
          No issues match the selected filter.
        </p>
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
        <p className="mt-2 text-subtle">Copyright © {currentYear}</p>
      </footer>
    </>
  );
}
