# Save Chats and Context from OpenAI to ComposeDB on Ceramic

Realtime chat using GraphQL Live Queries, Next.js, and ComposeDB.

To follow the full tutorial, go to the [tutorial](/tutorial.md) page.

## Getting Started

1. Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

The server configuration that's auto-generated when running this command is inmemory.

3. Create a .env file and enter the three required environment variables outlined in .env.example

(the only environment variable needed for this app is an openai API key)

4. Run the application (make sure you are using node version 16):

#### Development
```bash
nvm use 16
npm run dev
```

#### Build
```bash
npm run build
```

## Learn More

To learn more about Ceramic please visit the following links

- [ComposeDB Sandbox](https://composedb.js.org/sandbox) - Test your queries directly from your browser without any local dependencies.
- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!

## Credit

Credit to [ChatBase](https://github.com/notrab/chatbase) for an awesome template to work with.


