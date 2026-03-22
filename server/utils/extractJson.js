const extractJson = (text) => {
  if (!text) return null;

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let start = cleaned.indexOf("{");
  if (start === -1) return null;

  let count = 0;
  let end = -1;

  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === "{") count++;
    if (cleaned[i] === "}") count--;

    if (count === 0) {
      end = i;
      break;
    }
  }

  if (end === -1) return null;

  const jsonString = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.log("JSON Parse Error:", err.message);
    return null;
  }
};

export default extractJson;