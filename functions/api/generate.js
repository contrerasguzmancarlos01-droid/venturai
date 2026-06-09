export async function onRequestPost(context) {
  const { env } = context;
  const apiKey = env.GEMINI_API_KEY;

  try {
    // Consultamos la lista de modelos permitidos
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    // Devolvemos la lista para que la veas en el navegador
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error", details: err.message }), { status: 500 });
  }
}
