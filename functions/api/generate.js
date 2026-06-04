export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "Falta la clave GEMINI_API_KEY." } }), { status: 500 });
    }

    const body = await request.json();
    const geminiContents = body.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Construimos el cuerpo sin el campo conflictivo
    const geminiBody = {
      contents: geminiContents,
      generationConfig: { maxOutputTokens: 4096 }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error }), { status: res.status });
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el itinerario.";
    const anthropicMimic = { content: [{ type: "text", text: responseText }] };

    return new Response(JSON.stringify(anthropicMimic), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500 });
  }
}
