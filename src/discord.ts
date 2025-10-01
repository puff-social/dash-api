import { env } from "./env";

export async function sendDiscordMessage(
  embed: any,
  username = "puff.social Events",
): Promise<void> {
  const webhookUrl = env.ALERT_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL environment variable is not set");
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      embeds: [embed],
    }),
  });

  if (!response.ok) {
    console.error(`Failed to send Discord message: ${response.statusText}`);
  }
}
