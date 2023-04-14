import { Permissions as DiscordPermissions } from "discord.js-selfbot-v13";
import { PermissionFlags, Permissions } from "revolt-toolset";

export function discPerm2Revolt(perms: DiscordPermissions): PermissionFlags {
  const flags = new PermissionFlags(0);
  if (perms.has("ADMINISTRATOR")) return flags.add(Permissions.GrantAllSafe);

  if (perms.has("ADD_REACTIONS")) flags.add(Permissions.React);
  if (perms.has("ATTACH_FILES")) flags.add(Permissions.UploadFiles);
  if (perms.has("BAN_MEMBERS")) flags.add(Permissions.BanMembers);
  if (perms.has("CHANGE_NICKNAME")) flags.add(Permissions.ChangeNickname);
  if (perms.has("CONNECT")) flags.add(Permissions.Connect);
  if (perms.has("CREATE_INSTANT_INVITE")) flags.add(Permissions.InviteOthers);
  if (perms.has("EMBED_LINKS")) flags.add(Permissions.SendEmbeds);
  if (perms.has("KICK_MEMBERS")) flags.add(Permissions.KickMembers);
  if (perms.has("MANAGE_CHANNELS")) flags.add(Permissions.ManageChannel);
  if (perms.has("MANAGE_EMOJIS_AND_STICKERS")) flags.add(Permissions.ManageCustomisation);
  if (perms.has("MANAGE_GUILD")) flags.add(Permissions.ManageServer);
  if (perms.has("MANAGE_MESSAGES")) flags.add(Permissions.ManageMessages);
  if (perms.has("MANAGE_NICKNAMES")) flags.add(Permissions.ManageNicknames);
  if (perms.has("MANAGE_ROLES")) flags.add(Permissions.AssignRoles).add(Permissions.ManageRole);
  if (perms.has("MODERATE_MEMBERS")) flags.add(Permissions.TimeoutMembers);
  if (perms.has("READ_MESSAGE_HISTORY")) flags.add(Permissions.ReadMessageHistory);
  if (perms.has("SEND_MESSAGES")) flags.add(Permissions.SendMessage);
  if (perms.has("SPEAK")) flags.add(Permissions.Speak);
  if (perms.has("VIEW_CHANNEL")) flags.add(Permissions.ViewChannel);
  return flags;
}
