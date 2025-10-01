import fastify from "fastify";
import cors from "@fastify/cors";

import { env } from "./env";
import { AuthedRoutes } from "./routes";

import "./internal";

const server = fastify();

server.register(cors, {
  origin: true,
});

server.register(AuthedRoutes, { prefix: "/v1" });

server.get("/health", (req, res) => res.status(204).send());

server.setNotFoundHandler((req, res) => {
  res.status(404).send({ success: false, error: { code: "route_not_found" } });
});

server.listen({ port: env.PORT, host: "0.0.0.0" }, () => {
  console.log(`API > Listening on ${env.PORT}`);
});
