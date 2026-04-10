const OPENAI_API_KEY = process.env.OPENAI_API_KEY || Bun.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("⚠️  OPENAI_API_KEY not set. Create packages/api/.env with your key.");
}

Bun.serve({
  port: 3001,
  async fetch(req) {
    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (req.method !== "POST" || !new URL(req.url).pathname.startsWith("/api/chat")) {
      return new Response("Not found", { status: 404 });
    }

    if (!OPENAI_API_KEY) {
      return Response.json({ error: "API key not configured" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    try {
      const body = await req.json();
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: body.model || "gpt-4o-mini",
          messages: body.messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await res.json();
      return Response.json(data, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }
  },
});

console.log("🚀 API proxy running on http://localhost:3001");
