import { ActivityType, User as DiscordUser } from "discord.js";
import { UserStatus } from "revolt-api";
import { APIUser } from "revolt-toolset";
import mapAttachment from "./attachment";
import { snowflakeToULID } from "./ulid";

export default function mapUser(user: DiscordUser): APIUser {
  return {
    _id: snowflakeToULID(user.id),
    username: user.username,
    flags: 0,
    avatar: mapAttachment(user.id, user.displayAvatarURL({ size: 256, extension: "png" })),
    badges: 0,
    bot: user.bot ? { owner: snowflakeToULID(user.id) } : null,
    online: !!user.client.guilds.cache.find((g) => {
      const res = g.presences.resolve(user);
      if (!res) return false;
      return res.status !== "invisible" && res.status !== "offline";
    }), //TODO:
    privileged: false,
    profile: null,
    relationship: user.id == user.client.user.id ? "User" : "None",
    status:
      user.client.guilds.cache
        .filter((g) => g.presences.resolve(user))
        .first(1)
        .map((g): UserStatus => {
          const res = g.presences.resolve(user),
            activity = res.activities[0];
          return {
            presence: (() => {
              switch (res.status) {
                case "idle":
                  return "Idle";
                case "dnd":
                  return "Busy";
                case "online":
                default:
                  return "Online";
              }
            })(),
            text: activity
              ? (() => {
                  switch (activity.type) {
                    case ActivityType.Playing:
                      return "Playing ";
                    case ActivityType.Listening:
                      return "Listening to ";
                    case ActivityType.Watching:
                      return "Watching ";
                    case ActivityType.Competing:
                      return "Competing in ";
                    case ActivityType.Custom:
                    default:
                      return "";
                  }
                })() +
                  (
                    (activity.type == ActivityType.Custom ? activity.state : activity.name) || ""
                  ).trim() || null
              : null,
          };
        })[0] ?? null,
  };
}
