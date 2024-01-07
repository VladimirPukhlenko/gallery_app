export const getFormattedDate = (date: Date) => {
  const requiredDate = new Date(date || 0);
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  const formattedDate = requiredDate.toLocaleDateString("en-US", options);
  return formattedDate;
};
