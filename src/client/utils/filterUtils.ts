import { CollisionType, ConflictResponse } from '../lib/types';

export const filterConflicts = (
  conflicts: ConflictResponse,
  activeFilter: CollisionType | 'all'
): ConflictResponse => {
  if (activeFilter == "all") return conflicts

  return conflicts.filter(obj => {
    for (const slot of obj) {
      if (slot.collision_type == activeFilter) {
        return true
      }
    }

    return false;
  })
};

export const getFilterOptions = (conflicts: ConflictResponse) => {
  const totalIssues = conflicts.length

  return [
    { value: 'all', label: 'All Issues', count: totalIssues },
    {
      value: CollisionType.ROOM,
      label: 'Room Conflicts',
      count: 0, // hard to compute
    },
    {
      value: CollisionType.TEACHER,
      label: 'Teacher Conflicts',
      count: 0, // should we even compute this in options?
    },
    {
      value: CollisionType.CAPACITY,
      label: 'Capacity Conflicts',
      count: 0,
    },
    {
      value: CollisionType.OUTLOOK,
      label: 'Outlook Conflicts',
      count: 0
    }
  ];
};

export const getActiveFilterLabel = (
  activeFilter: CollisionType | 'all',
  filterOptions: ReturnType<typeof getFilterOptions>
) => {
  const option = filterOptions.find((opt) => opt.value === activeFilter);
  return `${option?.label} (${option?.count})`;
};
