import { getTimestamp } from "discord-snowflake";
import { encodeTime } from "ulid";

const TIME_LEN = 10,
  RANDOM_LEN = 16,
  RADIX = 35;

// Shamelessly adapted from https://stackoverflow.com/a/55646905
function hex2bigint(value: string) {
  const size = 10,
    factor = BigInt(RADIX ** size);
  let i = value.length % size || size,
    parts = [value.slice(0, i)];

  while (i < value.length) parts.push(value.slice(i, (i += size)));

  return parts.reduce((r, v) => r * factor + BigInt(parseInt(v, RADIX)), 0n);
}

export function snowflakeToULID(id: string) {
  return (
    encodeTime(getTimestamp(<any>id), TIME_LEN) +
    BigInt(id).toString(RADIX).toUpperCase().padStart(RANDOM_LEN, "Z")
  );
}
export function ulidToSnowflake(id: string) {
  return hex2bigint(id.slice(TIME_LEN).replace(/^Z+/i, "")).toString();
}
