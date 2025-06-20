import { Collisions, ConflictType } from '../lib/types';

export const filterConflicts = (
  conflicts: Collisions,
  activeFilter: ConflictType | 'all'
): Collisions => {
  return {
    rooms:
      activeFilter === 'all' || activeFilter === ConflictType.roomConflict
        ? conflicts.rooms
        : [],
    teachers:
      activeFilter === 'all' || activeFilter === ConflictType.teacherConflict
        ? conflicts.teachers
        : [],
  };
};

export const getFilterOptions = (conflicts: Collisions) => {
  const totalIssues = conflicts.rooms.length + conflicts.teachers.length;

  return [
    { value: 'all', label: 'All Issues', count: totalIssues },
    {
      value: ConflictType.roomConflict,
      label: 'Room Conflicts',
      count: conflicts.rooms.length,
    },
    {
      value: ConflictType.teacherConflict,
      label: 'Teacher Conflicts',
      count: conflicts.teachers.length,
    },
  ];
};

export const getActiveFilterLabel = (
  activeFilter: ConflictType | 'all',
  filterOptions: ReturnType<typeof getFilterOptions>
) => {
  const option = filterOptions.find((opt) => opt.value === activeFilter);
  return `${option?.label} (${option?.count})`;
};
