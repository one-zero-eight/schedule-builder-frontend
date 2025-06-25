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
    case CollisionType.OUTLOOK:
      return "Collision with something in outlook"
  }
}

export function groupNameToDisplayText(name: string | string[]): string {
  if (Array.isArray(name)) {
    if (name.length === 0) {
      return "EMPTY ARRAY!"
    }

    return `${name[0]}...`
  }

  return name;
}



export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getLengthOf2DArray(array: any[][]): number {
  return array.reduce((total, row) => total + row.length, 0)
}


export const hardcodedTokenBecauseIHateMyself = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NmJiNTM2ZGVjYjlkYWVmZWYyYTU1ZDEiLCJlbWFpbCI6ImFuLm5vdmlrb3ZAaW5ub3BvbGlzLnVuaXZlcnNpdHkiLCJ0ZWxlZ3JhbV9pZCI6OTQ3NjU3NDYxLCJleHAiOjE3NTA5MjU5MjEsImlhdCI6MTc1MDgzOTUyMSwic2NvcGUiOiJtZSJ9.ekcjXeOy0T00N59Syp9kWab_ZlYNHb5RyPszeUCqWP55m1-OB7ZXDyXaHfV0PU2oSFPofUQaSBrGmKktiF07hmODXJj6E6ZtEF-jzQA6QZJsN9xY-Cvo5GzkKa4qnvRtwB8m2zI8chW4sk7EcAjY2AIfKsxCedLX0Gf9fUNYbbBeoib5YyMxtr05B-PGf7HhnfCroyZjPrREX2OrpLhy2BhuV59i4dUbwKsDbxGSsz1aMzH4Ial-PHa-tkwBxT_l59RaGw1irOQZuGg-4hHp9lqVA4_iSbbC6IPpPheDMT9OmJVM7_YArHOi9KuDORwt8veo3Od7_cSStW52sYN0QQ"