import { useCallback, useState } from 'react';
import { SchemaIssue } from '../../../api/types';
import { CollisionType } from '../../../lib/types';

import { filterIgnoredIssues, getIgnoredIssuesIds } from '../../../lib/utils';
import {
  filterIssues,
  getActiveFilterLabel,
  getFilterOptions,
} from '../../../utils/filterUtils';
import APIForm from '../../components/apiToken/Form';
import { IssueCard } from '../../components/issue/IssueCard';
import LoadingButton from '../../components/LoadingButton';
import Link from '../../components/router/Link';
import useConflicts from '../../hooks/useConflicts';
import SvgIconSmile from '../../Smile';
import Header from './Header';

export default function Home() {
  const { issues: payload, updateIssues } = useConflicts();
  const { payload: issues, error, isLoading, step } = payload;

  const [activeFilter, setActiveFilter] = useState<CollisionType | 'all'>(
    'all'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ignoredIssues, setIgnoredIssues] = useState<SchemaIssue[]>([]);

  // Фильтруем игнорируемые конфликты
  const visibleIssues = filterIgnoredIssues(issues);

  const totalIssues = visibleIssues.length;
  const filterOptions = getFilterOptions(visibleIssues);
  const filteredIssues = filterIssues(visibleIssues, activeFilter);
  const filteredTotalIssues = filteredIssues.length;

  // Проверяем, есть ли игнорируемые конфликты
  const hasIgnoredIssues = getIgnoredIssuesIds().length > 0;

  // Обработчик для игнорирования конфликта
  const handleIgnoreIssue = useCallback(() => {
    // Обновляем состояние, чтобы перерендерить компонент
    setIgnoredIssues([...ignoredIssues]);
  }, [ignoredIssues]);

  return (
    <>
      <Header />
      <APIForm />
      <LoadingButton
        type="button"
        className="bg-primary disabled:opacity-50 text-base py-1 px-6 text-center rounded-full hover:brightness-75 disabled:hover:brightness-100 flex items-center justify-center gap-2 text-white cursor-pointer disabled:cursor-not-allowed"
        disabled={isLoading}
        onClick={() => updateIssues()}
        loadingText={step}
        isLoading={isLoading}
      >
        Check the schedule
      </LoadingButton>
      {error && <p className="text-red-500">Error: {error}</p>}

      {totalIssues > 0 && (
        <>
          <h3 className="text-lg font-semibold">
            Number of issues: {totalIssues}
          </h3>

          {/* Custom Filter Selector */}
          <div className="flex gap-4 items-center">
            <div className="relative w-full">
              <div className="p-0.5 bg-primary rounded-lg w-full">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-4 w-full bg-surface rounded-[calc(0.5rem-1px)] text-left min-w-[200px] flex justify-between items-center hover:bg-accent transition-all text-text filter-button"
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
                            type="button"
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
            <p className="text-sm text-textSecondary">
              Showing {filteredTotalIssues} of {totalIssues} issues
            </p>
          )}

          {hasIgnoredIssues && (
            <Link
              className="border-none text-sm text-textSecondary hover:text-text transition-colors"
              href="/ignored"
            >
              Show Ignored Conflicts
            </Link>
          )}
        </>
      )}

      <div className="flex flex-col gap-3 max-w-full overflow-x-hidden">
        {totalIssues === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center py-4 text-xl font-bold">
              No conflicts detected
            </p>
            <SvgIconSmile className="w-50 h-50" />
          </div>
        ) : (
          filteredIssues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              onIgnore={handleIgnoreIssue}
              mode="ignore"
            />
          ))
        )}
      </div>

      {totalIssues > 0 && filteredTotalIssues === 0 && (
        <p className="text-textSecondary text-center py-4">
          No issues match the selected filter.
        </p>
      )}
    </>
  );
}
