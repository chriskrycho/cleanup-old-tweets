# `cleanup-old-tweets`

Use the Twitter API to delete old tweets.

***NOTE:** You're welcome to use this, but I will not be taking pull requests or adding features. Fork the repo and make changes to your heart's content, though!*

## How to Use

-   Clone this repo

-   Run `npm install` or `yarn` (I'm using `npm` so that's what the lockfile has)

-   Create a `.env` file. It's `.gitignore`d so you'll never accidentally publish your credentials.

-   Register for a Twitter Developer account.

-   Create a Twitter app.

-   Copy the API Key and API Secret Key to `API_KEY` and `API_SECRET_KEY` values in `.env`. For example:

     ```
     API_KEY=abc123
     API_SECRET_KEY=XYZ098
     ```

-   Give the newly created app write permissions.

-   Copy the Access Token and Access Token Secret to the `ACCESS_TOKEN` and `ACCESS_TOKEN_SECRET` values in `.env`. Your `.env` should now be something like this:

    ```
    API_KEY=abc123
    API_SECRET_KEY=XYZ098
    ACCESS_TOKEN=1092387456JKLMN
    ACCESS_TOKEN_SECRET=6547832901YUIOP
    ```

-   Download your archive from Twitter. Copy the `.zip` file into `data` and unzip it.

-   Run `npm run clean-em` or `yarn clean-em`.
    -   To delete posts only before a certain date, pass `--before <YYYY-MM-DD>`. For example, running `npm run clean-em -- --before 2020-12-05` will delete any tweet posted on any date up to and including December 4, 2020, and will not delete any tweets from December 5, 2020 or later.
    -   To delete posts only on or after a certain date pass `--on-or-after <YYYY-MM-DD>`. For example, running `npm run clean-em -- --on-or-after 2010-01-01` will delete any tweet posted on any date start (and including) including January 1, 2010, and will not delete any tweets from December 31, 2009 or earlier.
    -   You can combine these.

**NOTE:** You may end up with a bunch of `ECONNRESET` errors in your `errors.json` file. I haven't bothered digging into why, because the actual deletion activity *works*.
