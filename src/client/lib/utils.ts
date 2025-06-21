import { CollisionType } from "./types";

export function formatTimeForMoscow(timeString: string): string {
  // Accepts time strings like: "17:33:22.719Z" and converts them to more concise time in Moscow timezone: "20:33"

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const fullTimestamp = `${today}T${timeString}`; // "YYYY-MM-DDTHH:MM:SS.MMMZ"
  const date = new Date(fullTimestamp);

  if (isNaN(date.getTime())) {
    console.error('Invalid time string:', timeString);
    return 'Invalid Time';
  }

  const moscowOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const moscowTime = new Date(date.getTime() + moscowOffset);

  const hours = moscowTime.getUTCHours().toString().padStart(2, '0');
  const minutes = moscowTime.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function collisionTypeToDisplayText(type: CollisionType): string {
  switch (type) {
    case CollisionType.CAPACITY:
      return "Capacity exceeded"
    case CollisionType.ROOM:
      return "The room is taken"
    case CollisionType.TEACHER:
      return "The teacher is busy"
    default:
      return "Unknown collision"
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const hardcodedTokenBecauseIHateMyself = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NmJiNTM2ZGVjYjlkYWVmZWYyYTU1ZDEiLCJlbWFpbCI6ImFuLm5vdmlrb3ZAaW5ub3BvbGlzLnVuaXZlcnNpdHkiLCJ0ZWxlZ3JhbV9pZCI6OTQ3NjU3NDYxLCJleHAiOjE3NTA2MDIxOTcsImlhdCI6MTc1MDUxNTc5Nywic2NvcGUiOiJtZSJ9.PKNzgENCaRKF0ZXO43BccmkTMFOX7s4Q_lENJlzfcJ1azAKrX0KvKQ49TAvq6VHR9JauPGL1YcN34iYz7QiFQZY7ju3uLXclDMoFBQqstIZqH0sqFT6fKgrR5obZjXJDtisV48hwQZqrZIabFpxdcPYhut79sdDo5ZBfxh2xNB2UNxk1eC-AAY-xt7MCRex66FdqgbEBc4RDl4ikfhMIohMbtgjYfseADwx6p-vj9NCb6aWQ1_v8me0k4dMzXm789coA9TqJZp-OetpzUZ7khixtxAlahrWbIlxqMzlpRqvDvapBzQNdcEaIDPZXRmijJf-uCbzEDap4NTqGfw3alw"
