import { SchemaIssue } from '../api/types';
import { IGNORED_ISSUES_KEY } from './constants';

export function formatTimeForMoscow(timeString: string): string {
  // Accepts time strings like: "17:33:22.719Z" and converts them to more concise time in Moscow timezone: "20:33"

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const fullTimestamp = `${today}T${timeString}`; // "YYYY-MM-DDTHH:MM:SS.MMMZ"
  const date = new Date(fullTimestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid Time';
  }

  const moscowOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const moscowTime = new Date(date.getTime() + moscowOffset);

  const hours = moscowTime.getUTCHours().toString().padStart(2, '0');
  const minutes = moscowTime.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatStringOrList(
  input: string | string[] | null,
  separator: string = ' / '
): string {
  if (!input) {
    return '';
  }
  if (Array.isArray(input)) {
    return input.join(separator);
  }
  return input;
}

// Helper functions to extract data from different issue types
function getLessonFromConflict(conflict: SchemaIssue) {
  if ('lesson' in conflict && conflict.lesson) {
    return conflict.lesson;
  }
  // For RoomIssue, use the first lesson
  if (
    'lessons' in conflict &&
    conflict.lessons &&
    conflict.lessons.length > 0
  ) {
    return conflict.lessons[0];
  }
  return null;
}

function getRoomFromConflict(conflict: SchemaIssue): string | string[] | null {
  if ('room' in conflict) {
    return conflict.room;
  }
  const lesson = getLessonFromConflict(conflict);
  return lesson?.room || null;
}

function getTeacherFromConflict(conflict: SchemaIssue): string {
  if ('teacher' in conflict) {
    return conflict.teacher;
  }
  const lesson = getLessonFromConflict(conflict);
  return lesson?.teacher || '';
}

export function getIssueId(issue: SchemaIssue): string {
  const lesson = getLessonFromConflict(issue);
  if (!lesson) return '';

  const room = getRoomFromConflict(issue);
  const teacher = getTeacherFromConflict(issue);

  // Создаем уникальный ID на основе свойств конфликта
  const base = `${lesson.lesson_name}_${lesson.weekday}_${lesson.start_time}_${lesson.end_time}_${room}_${teacher}_${issue.collision_type}`;

  // Добавляем дополнительные свойства в зависимости от типа конфликта
  if (lesson.a1_range) {
    return `${base}_${lesson.a1_range}`;
  }

  return base;
}

export function getIgnoredIssuesIds(): string[] {
  try {
    const ignored = localStorage.getItem(IGNORED_ISSUES_KEY);
    return ignored ? JSON.parse(ignored) : [];
  } catch (error) {
    return [];
  }
}

export function addIgnoredConflict(conflict: SchemaIssue): void {
  try {
    const ignoredIds = getIgnoredIssuesIds();
    const conflictId = getIssueId(conflict);

    if (!ignoredIds.includes(conflictId)) {
      ignoredIds.push(conflictId);
      localStorage.setItem(IGNORED_ISSUES_KEY, JSON.stringify(ignoredIds));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding ignored conflict to localStorage:', error);
  }
}

export function removeIgnoredConflict(conflict: SchemaIssue): void {
  try {
    const ignoredIds = getIgnoredIssuesIds();
    const conflictId = getIssueId(conflict);
    const filteredIds = ignoredIds.filter((id) => id !== conflictId);

    localStorage.setItem(IGNORED_ISSUES_KEY, JSON.stringify(filteredIds));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error removing ignored conflict from localStorage:', error);
  }
}

export function isConflictIgnored(conflict: SchemaIssue): boolean {
  const ignoredIds = getIgnoredIssuesIds();
  const conflictId = getIssueId(conflict);
  return ignoredIds.includes(conflictId);
}

export function filterIgnoredIssues(conflicts: SchemaIssue[]): SchemaIssue[] {
  return conflicts.filter((conflict) => !isConflictIgnored(conflict));
}

export function clearAllIgnoredConflicts(): void {
  localStorage.removeItem(IGNORED_ISSUES_KEY);
}

// Export helper functions for components
export { getRoomFromConflict, getTeacherFromConflict };

export function millisecondsToDays(milliseconds: number): number {
  return milliseconds / 1000 / 60 / 60 / 24;
}
