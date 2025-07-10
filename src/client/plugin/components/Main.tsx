// import { useContext, useState, useCallback } from 'react';
// import { CollisionType, ConflictResponse } from '../../lib/types';
// import { filterConflicts, getFilterOptions } from '../../utils/filterUtils';
// import {
//   getLengthOf2DArray,
//   filterIgnoredConflicts,
//   getIgnoredConflictIds,
// } from '../../lib/utils';

// import apiContext from '../contexts/apiTokenContext';
// import IgnoredConflictsPage from './IgnoredConflictsPage';
// import useTheme from '../hooks/useTheme';
// import ThemeProvider from './ThemeProvider';
// import ThemeSettings from './ThemeSettings';

// import useAPI from '../hooks/useAPI';
// import getAllCollisions from '../../lib/api/endpoints';

// function MainContent() {
//   const [callAPI, requestState] = useAPI(getAllCollisions, []);
//   const { payload: conflicts, isLoading, error, step } = requestState;

//   const [activeFilter, setActiveFilter] = useState<CollisionType | 'all'>(
//     'all'
//   );
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [ignoredConflicts, setIgnoredConflicts] = useState<ConflictResponse>(
//     []
//   );
//   const [currentPage, setCurrentPage] = useState<'main' | 'ignored'>('main');
//   const { token } = useContext(apiContext);
//   const { setIsSettingsOpen } = useTheme();

//   // Фильтруем игнорируемые конфликты
//   const visibleConflicts = filterIgnoredConflicts(conflicts);

//   const totalIssues = getLengthOf2DArray(visibleConflicts);
//   const filterOptions = getFilterOptions(visibleConflicts);
//   const filteredConflicts = filterConflicts(visibleConflicts, activeFilter);
//   const filteredTotalIssues = getLengthOf2DArray(filteredConflicts);
//   const currentYear = new Date().getFullYear();

//   // Проверяем, есть ли игнорируемые конфликты
//   const hasIgnoredConflicts = getIgnoredConflictIds().length > 0;

//   // Обработчик для игнорирования конфликта
//   const handleIgnoreConflict = useCallback(() => {
//     // Обновляем состояние, чтобы перерендерить компонент
//     setIgnoredConflicts([...ignoredConflicts]);
//   }, [ignoredConflicts]);

//   // Обработчик для переключения на страницу игнорируемых конфликтов
//   const handleShowIgnored = useCallback(() => {
//     setCurrentPage('ignored');
//   }, []);

//   // Обработчик для возврата на главную страницу
//   const handleBackToMain = useCallback(() => {
//     setCurrentPage('main');
//   }, []);

//   async function getConflicts() {
//     if (token === undefined || token === '') {
//       return;
//     }

//     await callAPI(token);
//   }

//   return (
//     <main className="text-center text-white flex flex-col gap-3 h-full">
//       <button
//         onClick={() => setIsSettingsOpen(true)}
//         className="p-2 text-textSecondary hover:text-text transition-colors absolute top-2 right-2"
//         title="Theme Settings"
//       >
//         ⚙️
//       </button>
//       {currentPage === 'ignored' ? (
//         <IgnoredConflictsPage onBack={handleBackToMain} conflicts={conflicts} />
//       ) : null}

//       <ThemeSettings />
//     </main>
//   );
// }

// export default function Main() {
//   return (
//     <ThemeProvider>
//       <MainContent />
//     </ThemeProvider>
//   );
// }
