import { useState } from 'react';
import { SchemaTeacher } from '../../api/types';

interface TeacherInfoProps {
  teacher: SchemaTeacher;
  showName?: boolean;
  className?: string;
}

export function TeacherInfo({ teacher, showName = true, className = '' }: TeacherInfoProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (teacher.email) {
      navigator.clipboard.writeText(teacher.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1500);
    }
  };

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {showName && <strong>{teacher.name}</strong>}
      {teacher.russian_name && <span className="text-gray-600">{teacher.russian_name}</span>}
      {teacher.email && (
        <button
          type="button"
          onClick={handleCopyEmail}
          className="text-blue-600 hover:underline cursor-pointer text-left"
        >
          {copiedEmail ? 'Copied!' : teacher.email}
        </button>
      )}
      {teacher.alias && (
        <a
          href={`https://t.me/${teacher.alias.replace(/^@/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {teacher.alias.startsWith('@') ? teacher.alias : `@${teacher.alias}`}
        </a>
      )}
      {teacher.student_group && <span>{teacher.student_group}</span>}
    </div>
  );
}
