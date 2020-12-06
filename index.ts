import Twitter from "twitter";
import { config } from "dotenv";

function assert(pred: unknown, msg?: string): asserts pred {
  if (!pred) {
    throw msg ?? "NOOOOOPE!";
  }
}

function apiKeys() {
  let { error, parsed } = config();
  if (error) {
    throw error;
  }

  assert(!!parsed);
  const {
    CONSUMER_KEY,
    CONSUMER_SECRET,
    ACCESS_TOKEN_KEY,
    ACCESS_TOKEN_SECRET,
  } = parsed;

  assert(
    typeof CONSUMER_KEY === "string",
    `"CONSUMER_KEY" is '${typeof CONSUMER_KEY}' instead of 'string'`
  );
  assert(
    typeof CONSUMER_SECRET === "string",
    `"CONSUMER_SECRET" is '${typeof CONSUMER_SECRET}' instead of 'string'`
  );
  assert(
    typeof ACCESS_TOKEN_KEY === "string",
    `"ACCESS_TOKEN_KEY" is '${typeof ACCESS_TOKEN_KEY}' instead of 'string'`
  );
  assert(
    typeof ACCESS_TOKEN_SECRET === "string",
    `"ACCESS_TOKEN_SECRET" is '${typeof ACCESS_TOKEN_SECRET}' instead of 'string'`
  );

  return {
    CONSUMER_KEY,
    CONSUMER_SECRET,
    ACCESS_TOKEN_KEY,
    ACCESS_TOKEN_SECRET,
  };
}

function loadTweetData(): string[] {
  // throw "not yet implemented";
  return [];
}

async function main() {
  const keys = apiKeys();

  const client = new Twitter({
    consumer_key: keys.CONSUMER_KEY,
    consumer_secret: keys.CONSUMER_SECRET,
    access_token_key: keys.ACCESS_TOKEN_KEY,
    access_token_secret: keys.ACCESS_TOKEN_SECRET,
  });

  let intoDeletion = (id: string) => client.post(`/statuses/destroy/${id}`);

  const tweetsToDelete = loadTweetData();
  await Promise.all(tweetsToDelete.map(intoDeletion));
}

main();
