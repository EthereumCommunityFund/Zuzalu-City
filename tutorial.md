# Save Chatbot Exchanges from OpenAI to ComposeDB on Ceramic

If you've interacted with projects like [Agent GPT](https://github.com/reworkd/AgentGPT), you might've noticed that creating relevant context for your LLM chatbot can provide further efficiency and effectiveness to your conversations. This context gets pre-loaded as a system variable during each query, meaning that your chatbot is not only responding to your most recent message, but is also simultaneously factoring any applicable context into account before responding. Such context can include anything from tonality presets, to lengthy business-specific language like technical documentation, and anything in between.

The purpose of this tutorial is to introduce you to the basics of ComposeDB (a graph database built on the Ceramic Network), how to perform writes and reads to your ComposeDB instance, how to authenticate users on your Ceramic node, all positioned around the use-case articulated above. 

## Ceramic Network

But first, what is Ceramic?

The [Ceramic Network](https://ceramic.network/) is a decentralized data protocol that leverages the transparency and provenance you can expect from a blockchain, with the cost efficiency and querying performance typically associated with a traditional database. Furthermore, Ceramic empowers developers to leverage the re-usable data formats stored within the Network, allowing teams to benefit from pre-existing user data to incorporate into their applications. Finally, when users interact with an application that utilizes Ceramic as its storage layer, any data they write to the network is entirely user-controlled, putting the question of ownership in users' hands instead of centralized entities.

### How does it Work?

The Ceramic Protocol is built on decentralized event streams, with individual user accounts (enabled by decentralized identifiers, or [DIDs](https://developers.ceramic.network/protocol/accounts/decentralized-identifiers/)) existing as the sole controller of every document they create. While other nodes in the network have read access to any data written to Ceramic, only the creator (or controller) of each document is able to change that document's data, restricting write access exclusively to the original creator.

How does this work? Each user account cryptographically signs data events and submits them to the network. The events are then stored in the Interplanetary File System (IPFS) using the IPLD protocol, which are organized into readable streams. Streams are designed to handle immense flexibility, enabling a myriad of different content types to be stored to be stored within, from user profiles and messages, to encrypted information only certain users can decrypt.

(For more information on controlling Accounts and Documents, visit [ComposeDB Concepts](https://composedb.js.org/docs/0.5.x/core-concepts)).

### Ceramic is a "Data Ledger"

It's also important to note that Ceramic can be viewed as a "Data Ledger" middleground between on-chain data and the off-chain universe. Given that Ceramic events are periodically rolled into a merkle tree and the root is published to the Ethereum blockchain (thus preserving consensus on the global ordering of Ceramic transactions), Ceramic contains characteristics that prevent it from being neatly assigned to a purely off or on-chain storage layer.

For more information on how Ceramic works, visit [How it Works](https://ceramic.network/how-it-works).

### ComposeDB

In this tutorial we will be using ComposeDB, a graph database built on Ceramic that offers further composability, ease-of-querying, and a familiar "database" feel to developers. ComposeDB comes with native support for GraphQL, and also automatically splits read/write load for additional performance. When running a Ceramic node with ComposeDB, developers can define their own [data models](https://composedb.js.org/docs/0.5.x/create-your-composite) using GraphQL, or choose to begin indexing on existing data models already defined by the community, or both! 

### Finally - Let's Talk About Nodes

If you were using a traditional database solution (like PostgreSQL, for example) as your storage layer, you might be running PostgreSQL in a local Docker instance during development and testing, and move over to a cloud-hosted instance on AWS in production. In a similar way, interacting with Ceramic and ComposeDB requires a Ceramic node that takes the place of your traditional database connection. 

However, your Ceramic node is different such that it's responsible for broadcasting data your users create to IPFS, and has the ability to retrieve information from other nodes in the network. Ceramic nodes can be configured with a myriad of server environments (determining whether nodes are connected to mainnet vs. testnet, for example), making it easy for developers to perform tests in a controlled setting prior to moving into production.

In this tutorial, we will ease you into operating a temporary node (set to run 'inmemory'), to help illustrate the basics of how nodes work with minimal setup.

Visit [Ceramic Nodes](https://developers.ceramic.network/build/cli/installation/) for more information (steps outlined on this page are not required for this tutorial).

## Let's Get Started!

1. [MetaMask Chrome Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
2. Node v16
3. An [OpenAI API key](https://platform.openai.com/signup) 

### Initial Setup

First, clone the repository and install your dependencies:

```bash
git clone https://github.com/ceramicstudio/ai-ceramic && cd ai-ceramic
npm install
```

Open the repository in your editor of choice to continue following along. 

Next, you will need to create an .env file at the root of your project's directory:

```bash
touch .env
```

The only environment variable needed for this tutorial is your `OPENAI_API_KEY`. 

Visit [OpenAI's API Signup](https://platform.openai.com/signup) page to create an account if you don't yet have one and generate an API key.
At the time of writing this tutorial, OpenAI is offering a free OpenAI API trial, with $5 worth of credit (which can take you a LONGGG way).

When finished with this step, your .env file should contain something that looks like this:

`OPENAI_API_KEY="sk-thisisabunchofL3ttersandNum8ers"`

### Generate Your Local Node Configuration

As mentioned above, this section will walk you through how to run a local node (set to inmemory as the network default). When our application starts up, we will be deploying ComposeDB schema definitions onto our node, and then writing to and reading from our node while we generate and consume data.

Before we're able to start up our application, we will need to define our [server configuration](https://composedb.js.org/docs/0.5.x/guides/composedb-server/server-configurations) and corresponding admin credentials.

Fortunately for you, we've done most of this work for you by providing [this script](https://github.com/ceramicstudio/ai-ceramic/blob/main/scripts/commands.mjs). 

All you need to do is run the following in your terminal:

```bash
npm run generate
```

Back in your text editor, navigate to your `composedb.config.json` and `admin_seed.txt` files in your project's root directory. Your `composedb.config.json` file contains your server presets, including the `inmemory` network setting mentioned previously. You'll also notice that your node will run IPFS in "bundled" mode, which is only an option when running inmemory or on our testnets. Finally, you'll notice that your "db" field within the "indexing" object is set to SQLite - an ideal option for simple testing purposes and early prototyping, but will need to be switched out for a PostgreSQL database when running in production.

For an example application that uses PostgreSQL, check out this example using [ComposeDB with Enabled HLL](https://github.com/mzkrasner/dappradar).

Finally, you'll notice that your `admin_seed.txt` file now contains a string of letters and numbers. This is the seed that will be used to authenticate your node when your application first starts up, but should be thought of as entirely separate from the authentication process we will use later to authenticate individual users and allow them to author their own data.

### Check Out Your Schema Definitions

Locate your /composites directory containing the pre-made graphql schema used in this tutorial. While there are 5 graphql files in total, once compiled your node will read and write to only 4 discrete model definitions: `BasicProfile`, `Posts`, `Context`, and `Following`. /composites/04-postsProfile.graphql exists only to enabled `Posts` to be queried as an array from within each `BasicProfile` instance, this existing solely to define a relation as opposed to a new model.

```graphql
# 00-basicProfile.graphql

type BasicProfile @createModel(accountRelation: SINGLE, description: "A basic Profile") {
  author: DID! @documentAccount 
  name: String! @string(minLength: 3, maxLength: 100)
  username: String! @string(minLength: 5, maxLength: 255)
  description: String @string(minLength: 3, maxLength: 100)
  gender: String @string(minLength: 3, maxLength: 100)
  emoji: String @string(minLength: 1, maxLength: 2)
}
```

```graphql
# 01-posts.graphql

type BasicProfile @loadModel(id: "$PROFILE_ID") {
    id: ID!
}

type Posts
    @createModel(accountRelation: LIST, description: "A simple Post")
    @createIndex(fields: [{ path: "created" }])
    @createIndex(fields: [{ path: "edited" }])
    @createIndex(fields: [{ path: "tag" }]) {
    author: DID! @documentAccount 
    body: String! @string(minLength: 1, maxLength: 100000)
    tag: String @string(minLength: 1, maxLength: 100)
    edited: DateTime
    created: DateTime!
    profileId: StreamID! @documentReference(model: "BasicProfile")
    profile: BasicProfile! @relationDocument(property: "profileId")
}
```

```graphql
# 02-context.graphql

type Context @createModel(accountRelation: SINGLE, description: "A basic context for a user") {
  author: DID! @documentAccount 
  context: String! @string(maxLength: 100000)
}
```

```graphql
# 03-following.graphql

type BasicProfile @loadModel(id: "$PROFILE_ID") {
    id: ID!
}

type Following @createModel(accountRelation: LIST, description: "Who do you follow?") {
    profileId: StreamID! @documentReference(model: "BasicProfile")
    profile: BasicProfile! @relationDocument(property: "profileId")
}
```

```graphql
# 04-postsProfile.graphql

type Posts @loadModel(id: "$POSTS_ID") {
    id: ID!
}

type BasicProfile @loadModel(id: "$PROFILE_ID") {
    posts: [Posts] @relationFrom(model: "Posts", property: "profileId")
}
```

You'll also notice that some of the models (take `BasicProfile` for example) contain a "SINGLE" accountRelation, while other models like `Posts` contain a "LIST" accountRelation. What this means is that any authenticated user is restricted to only one model instance document of any model type defining a "SINGLE" accountRelation, while users can have as many model instance documents of models defining a "LIST" accountRelation as they'd like. You can see how this might make sense in the context of a message or a post in a chat environment - each user will create many messages, whereas developers might want to ensure there is only one canonical user profile for each user. 

You'll also notice `@createIndex` directives used within the `Posts` model, for example. This designation enabled developers to query, filter, and order their data based on these fields (without these directives, this would not be possible). While this particular tutorial will not make use of filtering and ordering functionality, you can see how to craft queries using filtering and ordering in our [ComposeDB Sandbox](https://composedb.js.org/sandbox).

Finally, you'll see that we import models defined elsewhere within several of our files (importing `BasicProfile` into 01-posts.graphql, for example). This allows us to define relations (used in the `profileId` field of `Posts`). Since we want to dynamically import the stream ID's created at runtime to be used to define those relations, you can see how the file in /scripts/composites.mjs methodically pairs together with those import statements to guarantee they'll be defined when we start up our node. When booted, this script will dynamically write definitions to the files located in `/src/__generated__` that our client library will utilize throughout our application. 

When running in production, it's safe to assume that your application will be referencing predefined definitions that have already been deployed on your node, making the script referenced above irrelevant. 



