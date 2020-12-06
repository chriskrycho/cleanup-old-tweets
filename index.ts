import Twitter from "twitter";
import { config } from "dotenv";
import { log, logErr, map, forEach, not, matchedIn } from "./fn";

function assert(pred: unknown, msg?: string): asserts pred {
  if (!pred) {
    logErr(msg ?? "NOOOOOPE!");
    process.exit(1);
  }
}

function apiKeys() {
  let { error, parsed } = config();
  if (error) {
    throw error;
  }

  assert(!!parsed);
  const { API_KEY, API_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET } = parsed;

  assert(
    typeof API_KEY === "string",
    `"API_KEY" is '${typeof API_KEY}' instead of 'string'`
  );
  assert(
    typeof API_SECRET_KEY === "string",
    `"API_SECRET_KEY" is '${typeof API_SECRET_KEY}' instead of 'string'`
  );
  assert(
    typeof ACCESS_TOKEN === "string",
    `"ACCESS_TOKEN" is '${typeof ACCESS_TOKEN}' instead of 'string'`
  );
  assert(
    typeof ACCESS_TOKEN_SECRET === "string",
    `"ACCESS_TOKEN_SECRET" is '${typeof ACCESS_TOKEN_SECRET}' instead of 'string'`
  );

  return { API_KEY, API_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET };
}

function loadTweetData(): string[] {
  throw "not yet implemented";
}

const CALLER_ARGS = ["ts-node", "npm", "run", "yarn", "index.ts"];

function beforeDate() {
  const args = process.argv.filter(not(matchedIn(CALLER_ARGS)));
  assert(
    args.length === 0 || args.length === 2,
    "you can only pass --before <YYYY-MM-DD>"
  );

  return args.length === 2 ? Date.parse(args[1]) : null;
}

async function main() {
  const keys = apiKeys();

  const client = new Twitter({
    // bearer_token: keys.BEARER_TOKEN,
    consumer_key: keys.API_KEY,
    consumer_secret: keys.API_SECRET_KEY,
    access_token_key: keys.ACCESS_TOKEN,
    access_token_secret: keys.ACCESS_TOKEN_SECRET,
  });

  let intoDeletion = (id: string) =>
    client.post(`/statuses/destroy/${id}.json`, {});

  const tweetsToDelete = loadTweetData();
  await Promise.all(tweetsToDelete.map(intoDeletion))
    .then(map(({ id }) => id))
    .then(forEach(log))
    .catch(logErr);
}

main();
