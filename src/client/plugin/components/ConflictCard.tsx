import LessonCard from "./LessonCard"

import { type Conflict } from "../../lib/types";

interface ConflictCardProps {
  lesson: Conflict
}

export default function Card(props: ConflictCardProps) {
  return (
    <LessonCard {...props.lesson} />
  );
}
