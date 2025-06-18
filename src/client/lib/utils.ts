export function formatTimeForMoscow(timeString: string): string {
  // Accepts time strings like: "17:33:22.719Z" and converts them to more concise time in Moscow timezone: "20:33"

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const fullTimestamp = `${today}T${timeString}`; // "YYYY-MM-DDTHH:MM:SS.MMMZ"
  const date = new Date(fullTimestamp);
  
  if (isNaN(date.getTime())) {
    console.error("Invalid time string:", timeString);
    return "Invalid Time";
  }

  const moscowOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  const moscowTime = new Date(date.getTime() + moscowOffset);

  const hours = moscowTime.getUTCHours().toString().padStart(2, "0");
  const minutes = moscowTime.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}