import { Embed } from "discord.js";
import { APIEmbed } from "revolt-toolset";
import { mapMarkdown } from "./util";

export default function mapEmbed(embed: Embed): APIEmbed {
  //TODO: support more than just youtube bridging
  if (embed.provider?.name == "YouTube" && embed.video) {
    return {
      type: "Website",
      special: {
        type: "YouTube",
        id: embed.video.url.split("/embed/")[1],
      },
    };
  }

  let description = [];
  if (embed.title) {
    if (embed.url) description.push(`### [${embed.title}](${embed.url})`);
    else description.push(`### ${embed.title}`);
  }
  if (embed.description) description.push(mapMarkdown(embed.description));
  embed.fields?.forEach((field) => {
    description.push(`#### ${field.name}\n${mapMarkdown(field.value)}`);
  });
  if (embed.footer) {
    description.push(`##### ${embed.footer.text}`);
  }

  const bridged: APIEmbed = {
    type: "Text",
    title: embed.author?.name ?? null,
    icon_url: embed.author?.iconURL ?? null,
    colour: embed.hexColor ?? null,
    url: embed.author?.url ?? null,
    description: description.length ? description.join("\n") : null,
    media: null, //TODO:
  };
  Object.entries(bridged).forEach((b) => {
    // remove any empty keys
    if (b[1] === null) delete bridged[b[0]];
  });
  return bridged;
}
