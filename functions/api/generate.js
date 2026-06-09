export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    const body = await request.json();

    // Estructura mínima obligatoria para Gemini 1.5
    const payload = {
      contents: body.contents
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // Si la respuesta de Google NO es exitosa, devolvemos el error tal cual
    if (!res.ok) {
      return new Response(JSON.stringify({ 
        error: "Google API Error", 
        details: data 
      }), { 
        status: res.status,
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    // Si el servidor falla antes de llegar a Google
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), { status: 500 });
  }
}
