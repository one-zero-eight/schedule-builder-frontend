import LessonCard from "./LessonCard"

import { type Collisions } from "../../lib/types";

interface ConflictCardProps {
  lesson: Collisions[0]
}

export function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-0.5 bg-gradient-to-b from-[#8C35F6] to-[#5C20A6] rounded-lg">
      <div className="p-1 bg-gradient-to-b from-[#323232] to-[#282828] rounded-[calc(0.5rem-1px)] select-none">
        <div className="text-start text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Card(props: ConflictCardProps) {
  // Slot with only one collision
  if ("collision_type" in props.lesson) {
    return (
      <CardWrapper>
        <div>
          <LessonCard {...props.lesson} />
        </div>
      </CardWrapper>
    );
  }

  // Slot with multiple collisions
  return (
    <CardWrapper>
      <div className="flex flex-col items-center gap-2">
        <LessonCard {...props.lesson} />
        <h2 className="text-center text-red-500">Conflicts with</h2>
        {/* <div className="flex flex-col gap-2"> */}
          {props.lesson.collisions.map(data => <LessonCard key={data.lesson_name + data.weekday} {...data}/>)}
        {/* </div> */}
      </div>
    </CardWrapper>
  );
}
