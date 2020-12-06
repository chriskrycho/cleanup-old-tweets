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
    BEARER_TOKEN,
    API_KEY,
    API_SECRET_KEY,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET,
  } = parsed;

  assert(
    typeof BEARER_TOKEN === "string",
    `"BEARER_TOKEN" is '${typeof BEARER_TOKEN}' instead of 'string'`
  );
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

  return {
    BEARER_TOKEN,
    API_KEY,
    API_SECRET_KEY,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET,
  };
}

function loadTweetData(): string[] {
  throw "not yet implemented";
}

const log = (val: unknown) => console.log(val);
const logErr = (err: unknown) => console.error(err);

type Map = <A, B>(fn: (a: A) => B) => (as: A[]) => B[];
const map: Map = (cb) => (as) => as.map(cb);

type ForEach = <A>(op: (a: A) => void) => (as: A[]) => void;
const forEach: ForEach = (op) => (as) => as.forEach(op);

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
