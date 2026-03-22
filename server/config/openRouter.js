const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "nvidia/nemotron-3-super-120b-a12b:free";
// const model = "stepfun/step-3.5-flash:free";

const generateResponce = async (prompt) => {
  console.log("open router request come");
  // console.log(process.env.OPENROUTER_API_KEY)

  const res = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: `Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });
  console.log(process.env.OPENROUTER_API_KEY)

  if (!res.ok) {
    const errText = await res.text();
    console.log("Error response:", errText);
    try {
      const err = JSON.parse(errText);
      throw new Error(
        err.error?.message || err.message || "OpenRouter API error",
      );
    } catch (parseErr) {
      throw new Error(`OpenRouter API error (${res.status}): ${errText}`);
    }
  }

  const data = await res.json(); // ✅ FIXED
  console.log("data is received", data);
  console.log(JSON.stringify(data, null, 2));
  return data.choices[0].message.content;
};

export default generateResponce;
