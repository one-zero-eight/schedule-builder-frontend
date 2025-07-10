import { CollisionType, ConflictResponse } from '../lib/types';

export const filterConflicts = (
  conflicts: ConflictResponse,
  activeFilter: CollisionType | 'all'
): ConflictResponse => {
  if (activeFilter === 'all') {
    return conflicts;
  }

  return conflicts.filter((obj) => {
    return obj.some((slot) => slot.collision_type === activeFilter);
  });
};

export const getFilterOptions = (conflicts: ConflictResponse) => {
  const typeCounts = {
    [CollisionType.ROOM]: 0,
    [CollisionType.TEACHER]: 0,
    [CollisionType.CAPACITY]: 0,
    [CollisionType.OUTLOOK]: 0,
  };

  conflicts.flat().forEach((conflict) => {
    typeCounts[conflict.collision_type] += 1;
  });

  const totalIssues = conflicts.flat().length;

  return [
    { value: 'all', label: 'All', count: totalIssues },
    {
      value: CollisionType.ROOM,
      label: 'Room',
      count: typeCounts[CollisionType.ROOM],
    },
    {
      value: CollisionType.TEACHER,
      label: 'Teacher',
      count: typeCounts[CollisionType.TEACHER],
    },
    {
      value: CollisionType.CAPACITY,
      label: 'Capacity',
      count: typeCounts[CollisionType.CAPACITY],
    },
    {
      value: CollisionType.OUTLOOK,
      label: 'Outlook',
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
