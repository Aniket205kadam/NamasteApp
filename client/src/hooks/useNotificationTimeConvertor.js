const useNotificationTimeConvertor = (isoString, inChat = false) => {
  const date = new Date(isoString);
  const now = new Date();

  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const getDateOnly = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const dateOnly = getDateOnly(date);
  const today = getDateOnly(now);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const diff = (today - dateOnly) / (1000 * 60 * 60 * 24);

  if (dateOnly.getTime() === today.getTime()) {
    return inChat ? `TODAY` : timePart;
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return inChat ? `YESTERDAY` : `Yesterday`;
  } else if (diff < 7) {
    const weekday = date.toLocaleDateString([], { weekday: "long" });
    return inChat ? weekday.toUpperCase() : `${weekday}`;
  } else {
    const formattedDate = date.toLocaleDateString("en-GB");
    return `${formattedDate}`;
  }
};

export default useNotificationTimeConvertor;
