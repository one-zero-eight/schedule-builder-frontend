import LessonCard from "./LessonCard"

import { type LessonSlotWithCollisions, ConflictType } from "../../lib/types";

interface ConflictCardProps {
  conflictType: ConflictType,
  lesson: LessonSlotWithCollisions
}


export default function Card(props: ConflictCardProps) {
  return (
    <div className="p-0.5 bg-gradient-to-b from-[#8C35F6] to-[#5C20A6] rounded-lg">
      <div className="p-4 bg-gradient-to-b from-[#323232] to-[#282828] rounded-[calc(0.5rem-1px)] select-none">
        <div className="text-start">
          <h2>Warning</h2>
          <p className="text-subtle text-sm">Type: {props.conflictType}</p>
          <div className="flex flex-col items-center gap-2 mt-3">
            <LessonCard {...props.lesson} />
            <h2 className="text-center text-red-500">Conflicts with</h2>
            <div className="flex flex-col gap-2">
              {props.lesson.collisions.map(data => <LessonCard {...data}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
