import { clsx } from 'clsx';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SchemaCheckParameters, SchemaIssue, SchemaTeacher } from '../../../api/types';
import { getTeachersOptions } from '../../../lib/endpoints';
import { CollisionType } from '../../../lib/types';

import { filterIgnoredIssues, getIgnoredIssuesIds } from '../../../lib/utils';
import {
  filterIssues,
  getActiveFilterLabel,
  getFilterOptions,
} from '../../../utils/filterUtils';
import APIForm from '../../components/apiToken/Form';
import { IssueCard } from '../../components/issue/IssueCard';
import { LoadingButton } from '../../components/LoadingButton';
import Link from '../../components/router/Link';
import { TeacherInfo } from '../../components/TeacherInfo';
import useConflicts from '../../hooks/useConflicts';
import useToken from '../../hooks/useToken';
import { SvgIconSmile } from '../../Smile';
import { Header } from './Header';

const SOURCE_OPTIONS: { key: keyof SchemaCheckParameters; label: string }[] = [
  { key: 'care_about_core_courses', label: 'Core Courses' },
  { key: 'care_about_electives', label: 'Electives' },
];

const CHECK_OPTIONS: { key: keyof SchemaCheckParameters; label: string }[] = [
  { key: 'check_room_collisions', label: 'Room' },
  { key: 'check_teacher_collisions', label: 'Teacher' },
  { key: 'check_space_collisions', label: 'Space' },
  { key: 'check_outlook_collisions', label: 'Outlook' },
];

export function MainPage() {
  const { issues: payload, updateIssues, checkParameters, setCheckParameters } = useConflicts();
  const { payload: issues, error, isLoading, step } = payload;
  const { token } = useToken();

  const [activeFilter, setActiveFilter] = useState<CollisionType | 'all'>(
    'all'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ignoredIssues, setIgnoredIssues] = useState<SchemaIssue[]>([]);

  // Teacher search state
  const [teachers, setTeachers] = useState<SchemaTeacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Load teachers data
  useEffect(() => {
    if (!token) return;
    setTeachersLoading(true);
    getTeachersOptions(token)
      .then((result) => {
        if (result.success && result.payload) {
          setTeachers(result.payload.data);
        }
      })
      .finally(() => setTeachersLoading(false));
  }, [token]);

  // Fuse.js instance for searching
  const fuse = useMemo(() => {
    return new Fuse(teachers, {
      keys: ['name', 'russian_name', 'email', 'alias', 'student_group'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [teachers]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 10);
  }, [fuse, searchQuery]);

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

      {/* Teacher Search */}
      {token && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text">
            Search Teachers
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, telegram, or group..."
              className="w-full bg-surface border px-2 py-1 rounded-lg border-primary focus:border-primary/50"
            />
            {teachersLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              {searchResults.map((result, idx) => (
                <TeacherInfo
                  key={idx}
                  teacher={result.item}
                  className="p-3 border-b border-border last:border-b-0 hover:bg-accent text-sm text-textSecondary"
                />
              ))}
            </div>
          )}

          {searchQuery.trim() && searchResults.length === 0 && !teachersLoading && (
            <p className="text-sm text-textSecondary">No teachers found</p>
          )}
        </div>
      )}

      {token && (
        <>
          <label className="text-sm font-bold text-text">
            Sources
          </label>
          <div className="flex flex-wrap gap-3">
            {SOURCE_OPTIONS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer text-sm text-text">
                <input
                  type="checkbox"
                  checked={checkParameters[key]}
                  onChange={(e) =>
                    setCheckParameters({
                      ...checkParameters,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                {label}
              </label>
            ))}
          </div>
          <label className="text-sm font-bold text-text">
            Check for collisions
          </label>
          <div className="flex flex-wrap gap-3">
            {CHECK_OPTIONS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer text-sm text-text">
                <input
                  type="checkbox"
                  checked={checkParameters[key]}
                  onChange={(e) =>
                    setCheckParameters({
                      ...checkParameters,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                {label}
              </label>
            ))}
          </div>
          <LoadingButton
            type="button"
            className="bg-primary text-white border px-2 py-1 rounded-lg border-primary hover:brightness-90 disabled:opacity-50 disabled:hover:brightness-100 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            disabled={isLoading || !Object.values(checkParameters).some(Boolean)}
            onClick={() => updateIssues()}
            loadingText={step}
            isLoading={isLoading}
          >
            Check the schedule
          </LoadingButton>
          {error && <p className="text-red-500">Error: {error}</p>}
        </>
      )}

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
                  className="p-4 w-full bg-surface rounded-[calc(0.5rem-1px)] text-left min-w-[200px] flex justify-between items-center hover:bg-accent text-text"
                >
                  <span>
                    {getActiveFilterLabel(activeFilter, filterOptions)} ({' '}
                    {filteredTotalIssues} )
                  </span>
                  <svg
                    className={clsx('size-4', isDropdownOpen && 'rotate-180')}
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
                            className={clsx(
                              'w-full px-4 py-3 text-left',
                              activeFilter === option.value
                                ? 'bg-primary text-white font-medium hover:bg-primary'
                                : 'text-text hover:bg-accent'
                            )}
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
              className="border-none text-sm text-textSecondary hover:text-text"
              href="/ignored"
            >
              Show Ignored Conflicts
            </Link>
          )}
        </>
      )}

      {token && (
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
      )}

      {totalIssues > 0 && filteredTotalIssues === 0 && (
        <p className="text-textSecondary text-center py-4">
          No issues match the selected filter.
        </p>
      )}
    </>
  );
}
