export async function onRequest({ request, env }) {
  const fallback =
    "Sorry — I’m having trouble right now. Please try again in a moment.";
  let reply = fallback;

  if (request.method && request.method.toUpperCase() !== "POST") {
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    const message =
      typeof body.message === "string" ? body.message : "";

    const history = Array.isArray(body.history)
      ? body.history.filter(
          (m) =>
            m &&
            typeof m.role === "string" &&
            typeof m.content === "string"
        )
      : [];

    const lang = body.lang === "es" ? "es" : "en";

    if (!message) {
      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              lang === "es"
                ? "Eres un asistente de ScreenWiseATX. Sé conciso y claro."
                : "You are a ScreenWiseATX assistant. Be concise and clear.",
          },
          ...history,
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (groqRes.ok) {
      const data = await groqRes.json();
      reply =
        data?.choices?.[0]?.message?.content?.trim() || reply;
    }
  } catch (_) {
    // swallow errors to avoid 500s
  }

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}
