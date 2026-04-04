import http from "node:http";

import {
  handleHealthRequest,
  handleRecommendRequest,
  handleSampleProfilesRequest,
  handleScoreRequest,
} from "./apiHandlers.js";

const PORT = Number(process.env.PORT || 4010);

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

async function routeRequest(request) {
  if (request.method === "GET" && request.url === "/health") {
    return handleHealthRequest();
  }

  if (request.method === "GET" && request.url === "/profiles/sample") {
    return handleSampleProfilesRequest();
  }

  if (request.method === "POST" && request.url === "/score") {
    const payload = await readJsonBody(request);
    return handleScoreRequest(payload);
  }

  if (request.method === "POST" && request.url === "/recommend") {
    const payload = await readJsonBody(request);
    return handleRecommendRequest(payload);
  }

  return {
    status: 404,
    body: {
      ok: false,
      error: "Route not found",
    },
  };
}

const server = http.createServer(async (request, response) => {
  try {
    const result = await routeRequest(request);
    sendJson(response, result.status, result.body);
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

server.listen(PORT, () => {
  console.log(`BNBU algorithm server listening on http://localhost:${PORT}`);
});
