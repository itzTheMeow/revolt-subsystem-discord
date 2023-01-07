import { encodeTime } from "ulid";

const TIME_LEN = 10,
  RANDOM_LEN = 16,
  RADIX = 31,
  EPOCH = 1420070400000n,
  DISALLOWED = {
    I: "V",
    L: "W",
    O: "X",
    U: "Y",
  };

function replaceDisallow(str: string, reverse = false) {
  Object.entries(DISALLOWED).forEach(([d1, d2]) => {
    str = str.replace(new RegExp(reverse ? d2 : d1, "gi"), reverse ? d1 : d2);
  });
  return str;
}

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
    encodeTime(Number((BigInt(id) >> BigInt(22)) + EPOCH), TIME_LEN) +
    replaceDisallow(BigInt(id).toString(RADIX).toUpperCase()).padStart(RANDOM_LEN, "Z")
  );
}
export function ulidToSnowflake(id: string) {
  return hex2bigint(replaceDisallow(id.slice(TIME_LEN).replace(/^Z+/i, ""), true)).toString();
}
