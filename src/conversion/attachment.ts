import LZString from "lz-string";
import { APIAttachment } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapAttachment(id: string, url: string, size = 256): APIAttachment | null {
  return url
    ? {
        _id: snowflakeToULID(id),
        tag: LZString.compressToEncodedURIComponent(url),
        filename: url.split("/").pop(),
        metadata: {
          type: "Image",
          width: size,
          height: size,
        },
        content_type: "png",
        size: 0,
      }
    : null;
}
