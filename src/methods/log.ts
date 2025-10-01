import { FastifyReply, FastifyRequest } from "fastify";
import { LogTypes, logValidation } from "../validation";
import { ZodError } from "zod";
import { pika } from "../pika";
import { prisma } from "../connectivity/prisma";

export async function createLog(
  req: FastifyRequest<{ Querystring: { type: number; channel: string } }>,
  res: FastifyReply
) {
  let { type, channel } = req.query;
  type = Number(type);

  if (!LogTypes[type] || !logValidation[type])
    return res.status(400).send({ code: "invalid_log_type" });

  if (!channel) return res.status(400).send({ code: "missing_log_channel" });

  let logChannel = await prisma.log_channels.findFirst({
    where: { name: channel },
  });
  if (!logChannel)
    logChannel = await prisma.log_channels.create({
      data: { id: pika.gen("log_channel"), name: channel },
    });

  try {
    const body = await logValidation[type as LogTypes].parseAsync(req.body);
    const id = pika.gen("log");

    await prisma.logs.create({
      data: {
        id,
        type,
        channel: logChannel.id,
        data: body,
      },
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .send({ code: "validation_error", errors: error.issues });
    } else {
      console.log(error);
      return res.status(500).send({ code: "internal_error" });
    }
  }
}

export async function getLogChannels(req: FastifyRequest, res: FastifyReply) {
  const channels = await prisma.log_channels.findMany({
    include: { logs: { take: 10, orderBy: { timestamp: "desc" } } },
  });

  return res.status(200).send({ data: { channels } });
}

export async function getLogsInChannel(
  req: FastifyRequest<{
    Params: { id: string };
    Querystring: { limit: number; after: string };
  }>,
  res: FastifyReply
) {
  const { limit, after } = req.query;

  const logs = await prisma.logs.findMany({
    where: { channel: req.params.id },
    take: limit ?? undefined,
    cursor: after ? { id: after } : undefined,
    skip: after ? 1 : undefined,
    orderBy: { timestamp: after ? "asc" : "desc" },
  });

  return res
    .status(200)
    .send({ data: { logs: after ? logs.reverse() : logs } });
}
