export enum CollisionType {
  ROOM = "room",
  TEACHER = "teacher",
  CAPACITY = "capacity",
  OUTLOOK = "outlook",
}

type ConflictingLesson = {
  lesson_name: string;
  weekday: string;
  start_time: string;
  end_time: string;
  room: string;
  teacher: string;
  students_number: number;
};

export type CapacityConflict = ConflictingLesson & {
  collision_type: CollisionType.CAPACITY,
  group_name: string | string[],
  excel_range: string,
  room_capacity: number,
}

export type TeacherConflict = ConflictingLesson & {
  collision_type: CollisionType.TEACHER,
  group_name: string | string[],
  excel_range: string,
}

export type RoomConflict = ConflictingLesson & {
  collision_type: CollisionType.ROOM,
  group_name: string | string[],
  excel_range: string,
}

export type OutlookConflict = ConflictingLesson & {
  collision_type: CollisionType.OUTLOOK
}

export type Conflict = CapacityConflict | TeacherConflict | RoomConflict | OutlookConflict

export type ConflictResponse = Conflict[][]



