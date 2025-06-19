export type LessonSlot = {
  weekday: string;
  start: string;
  end: string;
  room: string;
  teacher: string;
  group_name: string | null;
};

export type LessonSlotWithCollisions = LessonSlot & {
  collisions: LessonSlot[];
};

export type Collisions = {
  rooms: LessonSlotWithCollisions[];
  teachers: LessonSlotWithCollisions[];
};


export enum ConflictType {
  roomConflict = "Room conflict",
  teacherConflict = "Teacher conflict",
}