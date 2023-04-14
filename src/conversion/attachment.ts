import LZString from "lz-string";
import { APIAttachment } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapAttachment(
  id: string,
  url: string,
  width = 256,
  height = 256,
  size = 0
): APIAttachment | null {
  return url
    ? {
        _id: snowflakeToULID(id),
        tag: LZString.compressToEncodedURIComponent(url),
        filename: url.split("/").pop().split("?")[0],
        metadata: {
          type: "Image",
          width,
          height,
        },
        content_type: "png",
        size,
      }
    : null;
}
