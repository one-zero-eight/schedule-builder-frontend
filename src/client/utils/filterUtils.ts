import { Collisions, CollisionType } from '../lib/types';

export const filterConflicts = (
  conflicts: Collisions,
  activeFilter: CollisionType | 'all'
): Collisions => {
  if (activeFilter == "all") return conflicts

  return conflicts.filter(obj => {
    if ("collisions" in obj) {
      // Slot with multiple collisions
      for (const slot of obj.collisions) {
        // If any of conflicting slots have filtered conflict type, then we display all
        if (slot.collision_type == activeFilter) {
          return true
        }
      }

    } else {
      // Slot with just one collision reason
      return obj.collision_type == activeFilter
    }
  })
};

export const getFilterOptions = (conflicts: Collisions) => {
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
