export enum CollisionType {
  ROOM = "room",
  TEACHER = "teacher",
  CAPACITY = "capacity",
}

export type LessonSlot = {
  lesson_name: string;
  weekday: string;
  start_time: string;
  end_time: string;
  room: string;
  teacher: string;
  group_name: string | null;
  students_number: number;
  excel_range: string;
};

export type LessonSlotWithCollision = LessonSlot & { collision_type: CollisionType }

export type LessonSlotWithCollisions = LessonSlot & {
  collisions: LessonSlotWithCollision[];
};

export type Collisions = (LessonSlotWithCollision | LessonSlotWithCollisions)[]
