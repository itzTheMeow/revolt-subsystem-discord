import { PermissionsBitField } from "discord.js";
import { PermissionFlags, Permissions } from "revolt-toolset";

export function discPerm2Revolt(perms: PermissionsBitField): PermissionFlags {
  const flags = new PermissionFlags(0);
  if (perms.has("Administrator")) return flags.add(Permissions.GrantAllSafe);

  if (perms.has("AddReactions")) flags.add(Permissions.React);
  if (perms.has("AttachFiles")) flags.add(Permissions.UploadFiles);
  if (perms.has("BanMembers")) flags.add(Permissions.BanMembers);
  if (perms.has("ChangeNickname")) flags.add(Permissions.ChangeNickname);
  if (perms.has("Connect")) flags.add(Permissions.Connect);
  if (perms.has("CreateInstantInvite")) flags.add(Permissions.InviteOthers);
  if (perms.has("EmbedLinks")) flags.add(Permissions.SendEmbeds);
  if (perms.has("KickMembers")) flags.add(Permissions.KickMembers);
  if (perms.has("ManageChannels")) flags.add(Permissions.ManageChannel);
  if (perms.has("ManageEmojisAndStickers")) flags.add(Permissions.ManageCustomisation);
  if (perms.has("ManageGuild")) flags.add(Permissions.ManageServer);
  if (perms.has("ManageMessages")) flags.add(Permissions.ManageMessages);
  if (perms.has("ManageNicknames")) flags.add(Permissions.ManageNicknames);
  if (perms.has("ManageRoles")) flags.add(Permissions.AssignRoles).add(Permissions.ManageRole);
  if (perms.has("ModerateMembers")) flags.add(Permissions.TimeoutMembers);
  if (perms.has("ReadMessageHistory")) flags.add(Permissions.ReadMessageHistory);
  if (perms.has("SendMessages")) flags.add(Permissions.SendMessage);
  if (perms.has("Speak")) flags.add(Permissions.Speak);
  if (perms.has("ViewChannel")) flags.add(Permissions.ViewChannel);
  return flags;
}
