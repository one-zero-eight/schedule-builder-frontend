import { SchemaIssue } from '../api/types';
import { CollisionType } from '../lib/types';

export const filterIssues = (
  issues: SchemaIssue[],
  activeFilter: CollisionType | 'all'
): SchemaIssue[] => {
  if (activeFilter === 'all') {
    return issues;
  }

  return issues.filter((issue) => {
    const type = issue.collision_type as string;
    return type === activeFilter;
  });
};

export const getFilterOptions = (issues: SchemaIssue[]) => {
  const typeCounts = {
    [CollisionType.ROOM]: 0,
    [CollisionType.TEACHER]: 0,
    [CollisionType.CAPACITY]: 0,
    [CollisionType.OUTLOOK]: 0,
  };

  issues.forEach((issue) => {
    const type = issue.collision_type as string;
    if (type === 'room') typeCounts[CollisionType.ROOM] += 1;
    else if (type === 'teacher') typeCounts[CollisionType.TEACHER] += 1;
    else if (type === 'capacity') typeCounts[CollisionType.CAPACITY] += 1;
    else if (type === 'outlook') typeCounts[CollisionType.OUTLOOK] += 1;
  });

  const totalIssues = issues.length;

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
