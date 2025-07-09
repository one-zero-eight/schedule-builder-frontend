import React, { useContext, useState, useCallback } from 'react';
import { CollisionType, ConflictResponse } from '../../lib/types';
import {
  filterConflicts,
  getActiveFilterLabel,
  getFilterOptions,
} from '../../utils/filterUtils';
import innohassleSvg from '../innohassle.svg';
import Card from './ConflictCard';
import {
  getLengthOf2DArray,
  filterIgnoredConflicts,
  getIgnoredConflictIds,
} from '../../lib/utils';
import APIForm from './apiToken/form';
import apiContext from '../contexts/apiTokenContext';
import IgnoredConflictsPage from './IgnoredConflictsPage';
import useTheme from '../hooks/useTheme';
import ThemeProvider from './ThemeProvider';
import ThemeSettings from './ThemeSettings';

import LoadingButton from './LoadingButton';
import ErrorText from './ErrorText';
import Header from '../pages/main/Header';
import useAPI from '../hooks/queryApi';
import getAllCollisions from '../../lib/api/apis';

function MainContent() {
  const [callAPI, requestState] = useAPI(getAllCollisions, []);
  const { payload: conflicts, isLoading, error, step } = requestState;

  const [activeFilter, setActiveFilter] = useState<CollisionType | 'all'>(
    'all'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ignoredConflicts, setIgnoredConflicts] = useState<ConflictResponse>(
    []
  );
  const [currentPage, setCurrentPage] = useState<'main' | 'ignored'>('main');
  const { token } = useContext(apiContext);
  const { setIsSettingsOpen } = useTheme();

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

  // Обработчик для переключения на страницу игнорируемых конфликтов
  const handleShowIgnored = useCallback(() => {
    setCurrentPage('ignored');
  }, []);

  // Обработчик для возврата на главную страницу
  const handleBackToMain = useCallback(() => {
    setCurrentPage('main');
  }, []);

  async function getConflicts() {
    if (token === undefined || token === '') {
      return;
    }

    await callAPI(token);
  }

  return (
    <main className="text-center text-white flex flex-col gap-3 h-full">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 text-textSecondary hover:text-text transition-colors absolute top-2 right-2"
        title="Theme Settings"
      >
        ⚙️
      </button>
      {currentPage === 'ignored' ? (
        <IgnoredConflictsPage onBack={handleBackToMain} conflicts={conflicts} />
      ) : (
        <>
          <Header />
          <APIForm />
          <LoadingButton
            className="bg-primary disabled:opacity-50 text-base py-1 px-6 text-center rounded-full hover:brightness-75 disabled:hover:brightness-100 flex items-center justify-center gap-2 text-white"
            disabled={isLoading}
            onClick={getConflicts}
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
                <button
                  className="text-sm text-textSecondary hover:text-text transition-colors"
                  onClick={handleShowIgnored}
                  title="Show ignored conflicts"
                >
                  Show Ignored Conflicts
                </button>
              )}
            </>
          )}

          <div className="flex flex-col gap-3 -mr-8">
            {filteredConflicts.map((data, index) => (
              <React.Fragment key={index}>
                {data.map((data2, index2) => (
                  <Card
                    key={index * data.length + index2}
                    onIgnore={handleIgnoreConflict}
                    lesson={data2}
                    mode="ignore"
                  />
                ))}
                <hr className="py-2 border-highlight" />
              </React.Fragment>
            ))}
          </div>

          {totalIssues > 0 && filteredTotalIssues === 0 && (
            <p className="text-subtle text-center py-4">
              No issues match the selected filter.
            </p>
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
              <span className="text-innohassle">Software Project 2025</span>{' '}
              course
            </p>
            <p className="mt-2 text-subtle">Copyright © {currentYear}</p>
          </footer>
        </>
      )}

      <ThemeSettings />
    </main>
  );
}

export default function Main() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
