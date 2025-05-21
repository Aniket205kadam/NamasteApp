const useChatTimeConvertor = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default useChatTimeConvertor;
