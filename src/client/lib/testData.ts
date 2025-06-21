import { type Collisions, CollisionType } from "./types";

export const collisionTestData: Collisions = [
  // Room conflicts (4 slots)
  {
    lesson_name: "Math 101",
    weekday: "Monday",
    start_time: "09:00",
    end_time: "10:30",
    room: "Room A",
    teacher: "Prof. Smith",
    group_name: "Group 1",
    students_number: 25,
    excel_range: "A1:B2",
    collisions: [
      {
        lesson_name: "Physics 101",
        weekday: "Monday",
        start_time: "09:00",
        end_time: "10:30",
        room: "Room A",
        teacher: "Prof. Johnson",
        group_name: "Group 2",
        students_number: 30,
        excel_range: "C1:D2",
        collision_type: CollisionType.ROOM
      },
      {
        lesson_name: "Chemistry 101",
        weekday: "Monday",
        start_time: "09:00",
        end_time: "10:30",
        room: "Room A",
        teacher: "Prof. Williams",
        group_name: "Group 3",
        students_number: 20,
        excel_range: "E1:F2",
        collision_type: CollisionType.ROOM
      }
    ]
  },
  {
    lesson_name: "Physics 101",
    weekday: "Monday",
    start_time: "09:00",
    end_time: "10:30",
    room: "Room A",
    teacher: "Prof. Johnson",
    group_name: "Group 2",
    students_number: 30,
    excel_range: "C1:D2",
    collision_type: CollisionType.ROOM
  },
  {
    lesson_name: "Biology 101",
    weekday: "Tuesday",
    start_time: "11:00",
    end_time: "12:30",
    room: "Room B",
    teacher: "Prof. Brown",
    group_name: "Group 4",
    students_number: 25,
    excel_range: "G1:H2",
    collisions: [
      {
        lesson_name: "History 101",
        weekday: "Tuesday",
        start_time: "11:00",
        end_time: "12:30",
        room: "Room B",
        teacher: "Prof. Davis",
        group_name: "Group 5",
        students_number: 30,
        excel_range: "I1:J2",
        collision_type: CollisionType.ROOM
      }
    ]
  },
  {
    lesson_name: "History 101",
    weekday: "Tuesday",
    start_time: "11:00",
    end_time: "12:30",
    room: "Room B",
    teacher: "Prof. Davis",
    group_name: "Group 5",
    students_number: 30,
    excel_range: "I1:J2",
    collision_type: CollisionType.ROOM
  },

  // Teacher conflicts (4 slots)
  {
    lesson_name: "English 101",
    weekday: "Wednesday",
    start_time: "13:00",
    end_time: "14:30",
    room: "Room C",
    teacher: "Prof. Wilson",
    group_name: "Group 6",
    students_number: 20,
    excel_range: "K1:L2",
    collisions: [
      {
        lesson_name: "Art 101",
        weekday: "Wednesday",
        start_time: "13:00",
        end_time: "14:30",
        room: "Room D",
        teacher: "Prof. Wilson",
        group_name: "Group 7",
        students_number: 15,
        excel_range: "M1:N2",
        collision_type: CollisionType.TEACHER
      },
      {
        lesson_name: "Music 101",
        weekday: "Wednesday",
        start_time: "13:00",
        end_time: "14:30",
        room: "Room E",
        teacher: "Prof. Wilson",
        group_name: "Group 8",
        students_number: 10,
        excel_range: "O1:P2",
        collision_type: CollisionType.TEACHER
      }
    ]
  },
  {
    lesson_name: "Art 101",
    weekday: "Wednesday",
    start_time: "13:00",
    end_time: "14:30",
    room: "Room D",
    teacher: "Prof. Wilson",
    group_name: "Group 7",
    students_number: 15,
    excel_range: "M1:N2",
    collision_type: CollisionType.TEACHER
  },
  {
    lesson_name: "Geography 101",
    weekday: "Thursday",
    start_time: "15:00",
    end_time: "16:30",
    room: "Room F",
    teacher: "Prof. Taylor",
    group_name: "Group 9",
    students_number: 25,
    excel_range: "Q1:R2",
    collisions: [
      {
        lesson_name: "PE 101",
        weekday: "Thursday",
        start_time: "15:00",
        end_time: "16:30",
        room: "Room G",
        teacher: "Prof. Taylor",
        group_name: "Group 10",
        students_number: 30,
        excel_range: "S1:T2",
        collision_type: CollisionType.TEACHER
      }
    ]
  },
  {
    lesson_name: "PE 101",
    weekday: "Thursday",
    start_time: "15:00",
    end_time: "16:30",
    room: "Room G",
    teacher: "Prof. Taylor",
    group_name: "Group 10",
    students_number: 30,
    excel_range: "S1:T2",
    collision_type: CollisionType.TEACHER
  },

  // Capacity conflicts (2 slots)
  {
    lesson_name: "Computer Science 101",
    weekday: "Friday",
    start_time: "10:00",
    end_time: "11:30",
    room: "Room H",
    teacher: "Prof. Anderson",
    group_name: "Group 11",
    students_number: 35,
    excel_range: "U1:V2",
    collision_type: CollisionType.CAPACITY
  },
  {
    lesson_name: "Data Science 101",
    weekday: "Friday",
    start_time: "10:00",
    end_time: "11:30",
    room: "Room H",
    teacher: "Prof. Anderson",
    group_name: "Group 12",
    students_number: 30,
    excel_range: "W1:X2",
    collision_type: CollisionType.CAPACITY
  }
];