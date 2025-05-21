const useDateConvertor = (dateArray) => {
  const [year, month, day, hour, minute, second, microseconds] = dateArray;
  const milliseconds = Math.floor(microseconds / 1000);
  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    milliseconds
  );
  const pad = (num, size = 2) => String(num).padStart(size, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}.` +
    `${String(microseconds).padStart(6, "0")}`
  );
};

export default useDateConvertor;