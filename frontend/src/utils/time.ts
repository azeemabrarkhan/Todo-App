export const getTimeDurationSince = (dateISO: string) => {
  const now = new Date();
  const past = new Date(dateISO);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 0) return "in the future";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
