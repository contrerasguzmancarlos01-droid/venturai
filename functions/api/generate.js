export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    const body = await request.json();

    // Estructura estándar de Google Gemini
    const geminiPayload = {
      contents: body.messages.map(msg => ({
        role: msg.role === 'system' || msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    };

    // Esta es la URL estándar y verificada. 
    // Usamos v1beta para modelos recientes.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Fallo en el proxy", details: err.message }), { status: 500 });
  }
}
