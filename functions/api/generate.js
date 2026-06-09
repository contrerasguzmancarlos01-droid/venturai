export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: { message: "El campo 'messages' es requerido." } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construimos los mensajes incluyendo el system si existe
    const messages = [];
    if (body.system) {
      messages.push({ role: "system", content: body.system });
    }
    messages.push(...body.messages);

    // Llamamos a Cloudflare Workers AI (sin API key, gratis)
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: messages,
      max_tokens: 4096
    });

    const responseText = response.response || "No se pudo generar el itinerario.";

    // Mismo formato que esperaba tu index.html
    const anthropicMimic = {
      content: [{ type: "text", text: responseText }]
    };

    return new Response(JSON.stringify(anthropicMimic), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: "Error en el servidor proxy: " + error.message } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
