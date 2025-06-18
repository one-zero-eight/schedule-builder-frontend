import { type Collisions } from "./types";

export const collisionTestData: Collisions = {
    rooms: [
        {
            weekday: "Monday",
            start: "08:30:00.000Z",
            end: "10:05:00.000Z",
            room: "A101",
            teacher: "Dr. Smith",
            group_name: "CS-101",
            collisions: [
                {
                    weekday: "Monday",
                    start: "09:00:00.000Z",
                    end: "10:30:00.000Z",
                    room: "A101",
                    teacher: "Prof. Johnson",
                    group_name: "MATH-202"
                },
                {
                    weekday: "Monday",
                    start: "08:45:00.000Z",
                    end: "10:15:00.000Z",
                    room: "A101",
                    teacher: "Dr. Lee",
                    group_name: "PHYS-105"
                }
            ]
        },
        {
            weekday: "Tuesday",
            start: "13:00:00.000Z",
            end: "14:35:00.000Z",
            room: "B205",
            teacher: "Prof. Brown",
            group_name: "ENG-210",
            collisions: [
                {
                    weekday: "Tuesday",
                    start: "13:30:00.000Z",
                    end: "15:00:00.000Z",
                    room: "B205",
                    teacher: "Dr. Wilson",
                    group_name: "CHEM-115"
                }
            ]
        },
        {
            weekday: "Wednesday",
            start: "10:15:00.000Z",
            end: "11:50:00.000Z",
            room: "C304",
            teacher: "Dr. Garcia",
            group_name: "BIO-150",
            collisions: [
                {
                    weekday: "Wednesday",
                    start: "10:00:00.000Z",
                    end: "11:30:00.000Z",
                    room: "C304",
                    teacher: "Prof. Taylor",
                    group_name: "HIST-101"
                },
                {
                    weekday: "Wednesday",
                    start: "11:00:00.000Z",
                    end: "12:30:00.000Z",
                    room: "C304",
                    teacher: "Dr. Martinez",
                    group_name: "ART-220"
                }
            ]
        },
        {
            weekday: "Thursday",
            start: "15:00:00.000Z",
            end: "16:35:00.000Z",
            room: "D412",
            teacher: "Prof. Anderson",
            group_name: "ECON-300",
            collisions: [
                {
                    weekday: "Thursday",
                    start: "15:30:00.000Z",
                    end: "17:00:00.000Z",
                    room: "D412",
                    teacher: "Dr. White",
                    group_name: "PHIL-201"
                }
            ]
        },
        {
            weekday: "Friday",
            start: "11:20:00.000Z",
            end: "12:55:00.000Z",
            room: "E109",
            teacher: "Dr. Harris",
            group_name: "PSYCH-180",
            collisions: [
                {
                    weekday: "Friday",
                    start: "11:00:00.000Z",
                    end: "12:30:00.000Z",
                    room: "E109",
                    teacher: "Prof. Clark",
                    group_name: "SOC-210"
                },
                {
                    weekday: "Friday",
                    start: "12:00:00.000Z",
                    end: "13:30:00.000Z",
                    room: "E109",
                    teacher: "Dr. Lewis",
                    group_name: "MUSIC-110"
                }
            ]
        }
    ],
    teachers: [
        {
            weekday: "Monday",
            start: "09:00:00.000Z",
            end: "10:30:00.000Z",
            room: "A101",
            teacher: "Prof. Johnson",
            group_name: "MATH-202",
            collisions: [
                {
                    weekday: "Monday",
                    start: "08:30:00.000Z",
                    end: "10:05:00.000Z",
                    room: "A101",
                    teacher: "Dr. Smith",
                    group_name: "CS-101"
                }
            ]
        },
        {
            weekday: "Tuesday",
            start: "13:30:00.000Z",
            end: "15:00:00.000Z",
            room: "B205",
            teacher: "Dr. Wilson",
            group_name: "CHEM-115",
            collisions: [
                {
                    weekday: "Tuesday",
                    start: "13:00:00.000Z",
                    end: "14:35:00.000Z",
                    room: "B205",
                    teacher: "Prof. Brown",
                    group_name: "ENG-210"
                },
                {
                    weekday: "Tuesday",
                    start: "14:00:00.000Z",
                    end: "15:30:00.000Z",
                    room: "B207",
                    teacher: "Dr. Wilson",
                    group_name: "CHEM-115-Lab"
                }
            ]
        },
        {
            weekday: "Wednesday",
            start: "10:00:00.000Z",
            end: "11:30:00.000Z",
            room: "C304",
            teacher: "Prof. Taylor",
            group_name: "HIST-101",
            collisions: [
                {
                    weekday: "Wednesday",
                    start: "10:15:00.000Z",
                    end: "11:50:00.000Z",
                    room: "C304",
                    teacher: "Dr. Garcia",
                    group_name: "BIO-150"
                }
            ]
        },
        {
            weekday: "Thursday",
            start: "15:30:00.000Z",
            end: "17:00:00.000Z",
            room: "D412",
            teacher: "Dr. White",
            group_name: "PHIL-201",
            collisions: [
                {
                    weekday: "Thursday",
                    start: "15:00:00.000Z",
                    end: "16:35:00.000Z",
                    room: "D412",
                    teacher: "Prof. Anderson",
                    group_name: "ECON-300"
                }
            ]
        },
        {
            weekday: "Friday",
            start: "11:00:00.000Z",
            end: "12:30:00.000Z",
            room: "E109",
            teacher: "Prof. Clark",
            group_name: "SOC-210",
            collisions: [
                {
                    weekday: "Friday",
                    start: "11:20:00.000Z",
                    end: "12:55:00.000Z",
                    room: "E109",
                    teacher: "Dr. Harris",
                    group_name: "PSYCH-180"
                },
                {
                    weekday: "Friday",
                    start: "12:00:00.000Z",
                    end: "13:30:00.000Z",
                    room: "E109",
                    teacher: "Dr. Lewis",
                    group_name: "MUSIC-110"
                }
            ]
        }
    ]
};