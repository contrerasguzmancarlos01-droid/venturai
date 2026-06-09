export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    const body = await request.json();
    
    // FORZAMOS LA ESTRUCTURA MÍNIMA QUE PIDE GOOGLE
    // Solo permitimos 'contents'. Eliminamos cualquier otra cosa que venga del frontend.
    const cleanPayload = {
      contents: body.contents
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanPayload)
    });

    const data = await res.json();

    if (!res.ok) {
      // Esto capturará el error específico de Google (ej: "Invalid JSON")
      return new Response(JSON.stringify({ error: `API Error ${res.status}: ${JSON.stringify(data.error)}` }), {
        status: 200, // Devolvemos 200 para que tu frontend pueda leer el JSON del error
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de servidor: " + err.message }), { status: 500 });
  }
}
