import { z } from "zod";

export enum LogTypes {
  NewUser,
  NewDevice,
  DeviceNewOwner,
  SiteFeedback,
  DeviceDabsUpdate,
  DeviceConnection,
  NewDebuggingSession,
}

export const logValidation = {
  [LogTypes.NewUser]: z.object({
    id: z.string(),
    name: z.string(),
    display_name: z.string(),
    auth_type: z.string(),
  }),
  [LogTypes.NewDevice]: z.object({
    id: z.string(),
    name: z.string(),
    device_model: z.string(),
    dabs: z.number(),
    firmware: z.string(),
    serial_number: z.string().optional(),
    mac: z.string(),
  }),
  [LogTypes.DeviceNewOwner]: z.object({
    id: z.string(),
    name: z.string(),
    old_owner: z.object({
      id: z.string(),
      name: z.string(),
      display_name: z.string(),
    }),
    new_owner: z.object({
      id: z.string(),
      name: z.string(),
      display_name: z.string(),
    }),
  }),
  [LogTypes.SiteFeedback]: z.object({
    id: z.string(),
    message: z.string(),
    ip: z.string(),
  }),
  [LogTypes.DeviceDabsUpdate]: z.object({
    id: z.string(),
    name: z.string(),
    dabs: z.number(),
  }),
  [LogTypes.DeviceConnection]: z.object({
    id: z.string(),
    name: z.string(),
  }),
  [LogTypes.NewDebuggingSession]: z.object({
    id: z.string(),
    identifier: z.string(),
    ip: z.string(),
    data: z.any(),
  }),
};
