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
  const typeCounts = {
    [CollisionType.ROOM]: 0,
    [CollisionType.TEACHER]: 0,
    [CollisionType.CAPACITY]: 0,
    [CollisionType.OUTLOOK]: 0,
  };

  conflicts.flat().forEach((conflict) => {
    typeCounts[conflict.collision_type]++;
  });

  const totalIssues = conflicts.flat().length;

  return [
    { value: 'all', label: 'All Issues', count: totalIssues },
    {
      value: CollisionType.ROOM,
      label: 'Room Conflicts',
      count: typeCounts[CollisionType.ROOM],
    },
    {
      value: CollisionType.TEACHER,
      label: 'Teacher Conflicts',
      count: typeCounts[CollisionType.TEACHER],
    },
    {
      value: CollisionType.CAPACITY,
      label: 'Capacity Conflicts',
      count: typeCounts[CollisionType.CAPACITY],
    },
    {
      value: CollisionType.OUTLOOK,
      label: 'Outlook Conflicts',
      count: typeCounts[CollisionType.OUTLOOK],
    },
  ];
};

export const getActiveFilterLabel = (
  activeFilter: CollisionType | 'all',
  filterOptions: ReturnType<typeof getFilterOptions>
) => {
  const option = filterOptions.find((opt) => opt.value === activeFilter);
  return `${option?.label} `;
};
