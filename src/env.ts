import { envsafe, port, str } from "envsafe";

export const env = envsafe({
  PORT: port({
    default: 8004,
  }),
  INT_PORT: port({
    default: 8006,
  }),
  REDIS_URI: str({
    desc: "Redis Server URI",
  }),
  ALERT_DISCORD_WEBHOOK_URL: str({
    desc: "Discord Webhook URL for alerts",
  }),
});
