export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    const body = await request.json();

    // --- TRANSFORMACIÓN DE FORMATO ---
    // Convertimos el formato OpenAI (messages) al formato Gemini (contents)
    const geminiPayload = {
      contents: body.messages.map(msg => ({
        role: msg.role === 'system' || msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload) // Enviamos el formato correcto
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error en el transformador", details: err.message }), { status: 500 });
  }
}
