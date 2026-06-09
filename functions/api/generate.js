export async function onRequestPost(context) {
  try {
    const { env } = context;
    const apiKey = env.GEMINI_API_KEY;

    // Llamada para listar modelos disponibles
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();

    // Devolvemos la lista para verla en la web
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
