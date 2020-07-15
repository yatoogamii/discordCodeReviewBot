export const parseMessage = (msgContent: string): { language: string; code: string } => {
  const arrayOfMsgContent = msgContent
    .trim()
    .split(/```|\n/)
    .filter(value => value !== "");
  return {
    language: arrayOfMsgContent[1],
    code: arrayOfMsgContent.slice(2).join("\n"),
  };
};
