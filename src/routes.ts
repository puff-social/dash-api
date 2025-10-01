import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { AuthMiddleware } from "./middleware";
import { createLog, getLogChannels, getLogsInChannel } from "./methods/log";

export function InternalRoutes(
  server: FastifyInstance,
  opts: FastifyPluginOptions,
  next: () => void
) {
  server.post("/log", createLog);

  next();
}

export function AuthedRoutes(
  server: FastifyInstance,
  opts: FastifyPluginOptions,
  next: () => void
) {
  server.register(AuthMiddleware, { required: true });

  server.get("/user", async (req, res) => {
    return res.status(200).send({
      success: true,
      data: {
        user: req.user,
        connection: req.linkedConnection,
      },
    });
  });

  server.get("/logs/channels", getLogChannels);
  server.get("/logs/channels/:id", getLogsInChannel);

  next();
}
