export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    const body = await request.json();

    // Estructura mínima que Google garantiza que acepta
    // Si tienes "system_instruction", asegúrate de que venga dentro de 'contents' 
    // o quítalo de aquí para probar la conexión básica.
    const payload = {
      contents: body.contents
    };

    // Usamos v1beta explícitamente porque es donde viven los modelos 1.5
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      // Si falla, devolvemos el error exacto de Google
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
    return new Response(JSON.stringify({ error: "Local Server Error", details: err.message }), { status: 500 });
  }
}
