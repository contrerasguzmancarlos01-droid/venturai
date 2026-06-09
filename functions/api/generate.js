export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    // Definimos un payload estático de prueba para descartar errores del frontend
    const testPayload = {
      contents: [{
        role: "user",
        parts: [{ text: "Hola, ¿puedes saludar?" }]
      }]
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const data = await res.json();

    return new Response(JSON.stringify({ 
      status: res.status, 
      apiResponse: data 
    }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error critico", details: err.message }), { status: 500 });
  }
}
