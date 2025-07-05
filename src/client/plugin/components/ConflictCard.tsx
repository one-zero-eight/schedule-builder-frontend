import LessonCard from "./LessonCard"
import { type Conflict } from "../../lib/types";

interface ConflictCardProps {
  lesson: Conflict;
  onIgnore?: () => void;
  mode?: 'ignore' | 'restore';
}

export default function Card(props: ConflictCardProps) {
  return (
    <LessonCard 
      lesson={props.lesson} 
      onIgnore={props.onIgnore} 
      mode={props.mode}
    />
  );
}
