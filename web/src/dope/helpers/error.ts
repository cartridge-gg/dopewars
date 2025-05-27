export const errorMessage = (message: string) => {
  const startIndex = message.indexOf("('");
  const endIndex = message.indexOf("')");
  // console.log(message, startIndex, endIndex)
  if (!startIndex && !endIndex) {
    return message;
  }

  return message.substring(startIndex + 2, endIndex);
};
