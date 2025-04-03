/* eslint-disable no-useless-escape */
function extractUrl(text: string) {
  const urlRegex =
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

  const match = text.match(urlRegex);

  if (match) {
    return match[0];
  } else {
    return null;
  }
}

export default extractUrl;
