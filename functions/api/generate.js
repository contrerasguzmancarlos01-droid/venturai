export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Ahora buscaremos la clave de Gemini en Cloudflare
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Falta la clave GEMINI_API_KEY en Cloudflare." } }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();

    // Traducimos los mensajes del formato Claude al formato Gemini
    const geminiContents = body.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const geminiBody = {
      contents: geminiContents,
      generationConfig: { maxOutputTokens: 4096 }
    };

    // Ajuste para v1 estable: cambiamos systemInstruction por system_instruction
    if (body.system) {
      geminiBody.system_instruction = { parts: [{ text: body.system }] };
    }

    // Llamamos a la API estable de Google Gemini
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error }), { status: res.status });
    }

    // Extraemos el texto que ha generado Gemini
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el itinerario.";

    // ¡El disfraz! Creamos la misma estructura que esperaba tu index.html
    const anthropicMimic = {
      content: [{ type: "text", text: responseText }]
    };

    return new Response(JSON.stringify(anthropicMimic), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: "Error en el servidor proxy Gemini: " + error.message } }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
    );
  }
}
