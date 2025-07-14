import { Conflict, ConflictResponse } from '../lib/types';



export const groupConflictsByCourse = (conflicts: ConflictResponse) => {
    const coursesByConflict: { [key: string]: Conflict[][] } = {};
    
    conflicts.forEach((conflictGroup) => {
      // Создаем множество уникальных курсов для этой группы конфликтов
      const coursesInGroup = new Set<string>();
      
      conflictGroup.forEach((conflict) => {
        const courseName = conflict.lesson_name
          .replace("(tut)", "")
          .replace(/\(lec\)/g, "")
          .replace(/\(lab\)/g, "")
          .trim();
        coursesInGroup.add(courseName);
      });
      
      // Добавляем эту группу конфликтов в каждый соответствующий курс
      coursesInGroup.forEach((courseName) => {
        if (!coursesByConflict[courseName]) {
          coursesByConflict[courseName] = [];
        }
        coursesByConflict[courseName].push(conflictGroup);
      });
    });
    
    return coursesByConflict;
  };