import Twitter from "twitter";
import { config } from "dotenv";
import { logErr, not, matchedIn } from "./fn";
import { readFileSync } from "fs";
import type { Tweet } from "./tweet";
import { Result } from "true-myth";
import { writeFile } from "fs/promises";
import Maybe from "true-myth/maybe";

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

type FilterDates = { before?: number; onOrAfter?: number };

function loadTweetData({
  before = Date.now(),
  onOrAfter = Date.parse("2000-01-01"),
}: FilterDates): Tweet[] {
  let rawData = readFileSync("./data/tweet.js", { encoding: "utf-8" });
  let sansWindowNonsense = rawData.replace("window.YTD.tweet.part0 = ", "");
  const tweets = JSON.parse(sansWindowNonsense) as Tweet[];
  return tweets.filter(({ created_at }) => {
    let createdAt = Date.parse(created_at);
    return createdAt < before && createdAt >= onOrAfter;
  });
}

const CALLER_ARGS = ["ts-node", "npm", "run", "yarn", "index.ts"];

const DATE_RE = /\d{4}-\d{2}-\d{2}/;

const isDate = (s: string) => DATE_RE.test(s);

const isBefore = (a: string, b: string) => a === "--before" && isDate(b);

const isOnOrAfter = (a: string, b: string) =>
  a === "--on-or-after" && isDate(b);

function filterDates(): FilterDates {
  const args = process.argv.filter(not(matchedIn(CALLER_ARGS)));
  assert(
    args.length === 0 ||
      (args.length === 2 &&
        (isBefore(args[0], args[1]) || isOnOrAfter(args[0], args[1]))) ||
      (args.length === 4 &&
        ((isBefore(args[0], args[1]) && isOnOrAfter(args[2], args[4])) ||
          (isBefore(args[2], args[3]) && isOnOrAfter(args[0], args[1])))),
    "you can only pass --before <YYYY-MM-DD>, --on-or-after <YYYY-MM-DD>, or a combination of the two"
  );

  switch (args.length) {
    case 0:
      return {};
    case 2:
      return isBefore(args[0], args[1])
        ? { before: Date.parse(args[1]) }
        : { onOrAfter: Date.parse(args[1]) };
    case 4:
      return isBefore(args[0], args[1])
        ? {
            before: Date.parse(args[1]),
            onOrAfter: Date.parse(args[3]),
          }
        : {
            before: Date.parse(args[3]),
            onOrAfter: Date.parse(args[1]),
          };
    default:
      throw "This is an error";
  }
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

  let intoDeletion = ({ id }: Tweet) =>
    client
      .post(`/statuses/destroy/${id}.json`, {})
      .then(({ id }) => Result.ok<string, unknown>(id))
      .catch((err: unknown) => Result.err<string, unknown>(err));

  const deletions = loadTweetData(filterDates()).map(intoDeletion);

  Promise.all(deletions)
    .then((results) =>
      results.reduce(
        ([count, errs], result) =>
          result.match({
            Ok: (_) => [count + 1, errs] as [number, unknown[]],
            Err: (err) => [count, errs.concat(err)] as [number, unknown[]],
          }),
        [0, []] as [number, unknown[]]
      )
    )
    .then(([count, errs]) => {
      console.log(`deleted ${count} (out of ${deletions.length})`);

      if (errs.length) {
        let errsFile = "errors.json";
        console.info(`also had ${errs.length} errs, printing to ${errsFile}`);
        return writeFile("errors.json", JSON.stringify(errs, null, 2));
      } else {
        return;
      }
    })
    .catch(logErr);
}

main();
