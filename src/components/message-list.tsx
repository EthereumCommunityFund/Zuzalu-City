import { useEffect, useState, useRef } from "react";
import { authenticateCeramic } from "../../utils";
import { useCeramicContext } from "../context";
import { PostProps } from "../../utils/types";
import { Message } from "@/components/message";
import { Profile } from "../../utils/types";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import seedrandom from "seedrandom";
import { Ed25519Provider } from "key-did-provider-ed25519";

export const MessageList = () => {
  const clients = useCeramicContext();
  const [posts, setPosts] = useState<PostProps[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState("");
  const [body, setBody] = useState("");
  const [context, setContext] = useState<string>();
  const { ceramic, composeClient } = clients;
  const [write, setWrite] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<PostProps>();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [robotProfile, setRobotProfile] = useState<Profile | undefined>();
  const [robotDID, setRobotDID] = useState<DID | undefined>();
  const messageRef = useRef<HTMLDivElement>(null);

  //allows us to create a robot DID for the bot in order to post messages as another user
  const createRobotDID = async () => {
    const uniqueKey = localStorage.getItem("id");
    if (uniqueKey) {
      const rng = seedrandom(uniqueKey);
      const seed = new Uint8Array(32);
      for (let i = 0; i < 32; i += 1) {
        seed[i] = Math.floor(rng() * 256);
      }
      const staticDid = new DID({
        provider: new Ed25519Provider(seed),
        //@ts-ignore
        resolver: KeyResolver.getResolver(),
      });
      await staticDid.authenticate();
      //authenticate on ceramic instance
      composeClient.setDID(staticDid);
      ceramic.did = staticDid;

      setRobotDID(staticDid);
      if (!localStorage.getItem("robotDID")) {
        localStorage.setItem("robotDID", staticDid.id);
      }
      return staticDid;
    }
  };

  /* we can get context based on index in this case since we only allow users to edit their
  own context on the /context page */
  const getContext = async () => {
    setLoading(true);
    await authenticateCeramic(ceramic, composeClient);
    const existingContext = await composeClient.executeQuery<{
      contextIndex: { edges: { node: { id: string; context: string } }[] };
    }>(`
        query {
            contextIndex(first: 1) {
                edges {
                    node {
                        id
                        context
                    }
                }
            }
        }
      `);
    console.log(existingContext);
    if (
      existingContext?.data?.contextIndex?.edges[0]?.node?.context !== undefined
    ) {
      setContext(existingContext?.data?.contextIndex?.edges[0]?.node?.context);
    }
    setLoading(false);
  };

  /*
  Get only messages relevant to the user and the bot using filters
  */
  const GetRecentMessagesQuery = async () => {
    const messages = await composeClient.executeQuery<{
      postsIndex: { edges: { node: PostProps }[] };
    }>(`
      query  {
        postsIndex(
          filters: {
            or: [
              {where: 
                { authorId: 
                   { equalTo: "${localStorage.getItem("id")}" } 
                }
              }
              {where: 
                { authorId: 
                   { equalTo: "${localStorage.getItem("robotDID")}" } 
                  }
                 }
                ]
             } 
          last: 100) {
          edges {
            node {
              id
              body
              tag
              created
              profile{
                id
                name
                username
                emoji
                gender
              }
              authorId
            }
          }
        }
      }
    `);
    console.log(messages);
    if (messages?.data?.postsIndex?.edges) {
      const newPosts = messages?.data?.postsIndex?.edges.map((edge) => ({
        id: edge.node.id,
        body: edge.node.body,
        profile: edge.node.profile,
        tag: edge.node.tag,
        created: edge.node.created,
        authorId: edge.node.authorId,
      }));
      console.log(newPosts);
      setPosts([...posts, ...newPosts]);
      return messages?.data?.postsIndex?.edges;
    }
  };

  const getProfile = async () => {
    await authenticateCeramic(ceramic, composeClient);
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery<{
        viewer: { basicProfile: Profile };
      }>(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      console.log(profile);
      if (profile?.data?.viewer?.basicProfile !== null) {
        setProfile(profile?.data?.viewer?.basicProfile);
      } else {
        window.location.href = "/profile";
      }
      return profile?.data?.viewer?.basicProfile;
    }
  };

  const getRobotProfile = async () => {
    await createRobotDID();
    const profile = await composeClient.executeQuery<{
      viewer: { basicProfile: Profile };
    }>(`
      query {
        viewer {
          basicProfile {
            id
            name
            username
            description
            gender
            emoji
          }
        }
      }
      `);
    console.log(profile);
    if (profile?.data?.viewer?.basicProfile !== null) {
      setRobotProfile(profile?.data?.viewer?.basicProfile);
    } else {
      window.location.href = "/profile";
    }
  };

  const createPost = async (thisPost: string) => {
    if (profile !== undefined) {
      await authenticateCeramic(ceramic, composeClient);
      const post = await composeClient.executeQuery<{
        createPosts: {
          document: PostProps;
        };
      }>(`
        mutation {
          createPosts(input: {
            content: {
              body: "${thisPost}"
              created: "${new Date().toISOString()}"
              profileId: "${profile.id}"
              authorId: "${localStorage.getItem("id")}"
            }
          })
          {
            document {
              id
              body
              tag
              created
              profile{
                id
                name
                username
                emoji
                gender
              }
              authorId
            }
          }
        }
      `);
      console.log(post);
      if (post.data?.createPosts?.document?.body) {
        const createdPost: PostProps = {
          id: post.data?.createPosts?.document?.id,
          body: post.data?.createPosts?.document?.body,
          profile: post.data?.createPosts?.document?.profile,
          tag: post.data?.createPosts?.document?.tag,
          created: post.data?.createPosts?.document?.created,
          authorId: post.data?.createPosts?.document?.authorId,
        };
        return createdPost;
      }
    }
  };

  /* a response is triggered each time we sent a message
  which then hits our api found in /pages/api/ai, and stream the response
  back to the frontend */
  const triggerResponse = async (message: string, inputPost: PostProps) => {
    try {
      setLoading(true);
      const messages: { role: string; content: string }[] = [];
      posts.forEach((post) => {
        messages.push({
          role:
            post.profile.author?.id === robotProfile?.author?.id
              ? "assistant"
              : "user",
          content: post.body,
        });
      });
      const response = await fetch("/api/chat/ai", {
        method: "POST",
        body: JSON.stringify({
          message,
          messages,
          context,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok || !response.body) {
        throw response.statusText;
      }
      const blankPost: PostProps = {
        id: "",
        body: "",
        profile: {
          description: robotProfile?.description,
          username: robotProfile?.username,
          gender: robotProfile?.gender,
          emoji: robotProfile?.emoji,
        },
        tag: "bot",
        created: new Date().toISOString(),
        authorId: robotProfile?.author?.id,
      };
      setNewPost(blankPost);
      setWrite(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let str = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          await createRobotDID();
          const post = await composeClient.executeQuery<{
            createPosts: {
              document: PostProps;
            };
          }>(`
            mutation {
              createPosts(input: {
                content: {
                  body: """${str}"""
                  created: "${new Date().toISOString()}"
                  profileId: "${robotProfile?.id}"
                  authorId: "${localStorage.getItem("robotDID")}"
                }
              })
              {
                document {
                  id
                  body
                  tag
                  created
                  profile{
                    id
                    name
                    username
                    emoji
                    gender
                  }
                  authorId
                }
              }
            }
          `);
          console.log(post);
          if (post.data?.createPosts?.document?.body) {
            const createdPost: PostProps = {
              id: post.data?.createPosts?.document?.id,
              body: post.data?.createPosts?.document?.body,
              profile: post.data?.createPosts?.document?.profile,
              tag: post.data?.createPosts?.document?.tag,
              created: post.data?.createPosts?.document?.created,
              authorId: post.data?.createPosts?.document?.authorId,
            };
            console.log(posts);
            setWrite(false);
            setNewPost(undefined);
            setPosts([...posts, inputPost, createdPost]);
            setData("");
          }
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        setData((prevValue) => `${prevValue.concat(decodedChunk)}`);
        str = str.concat(decodedChunk);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    getRobotProfile();
    GetRecentMessagesQuery();
    getContext();
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [posts, write]);

  return (
    <>
      <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
              {posts.length &&
                posts.map((post) => (
                  <Message
                    key={post?.id}
                    profile={post.profile}
                    body={post.body}
                    created={post.created}
                    id={post.id}
                    authorId={post.authorId}
                  />
                ))}
              {write && newPost && (
                <Message
                  key={newPost?.id}
                  profile={newPost.profile}
                  body={data}
                  created={newPost.created}
                  id={newPost.id}
                  authorId={newPost.authorId}
                />
              )}
              <div ref={messageRef}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/5 border-t border-[#363739]">
        <div className="max-w-4xl mx-auto">
          <form
            onClick={async (e) => {
              e.preventDefault();
              if (body) {
                console.log(body);
                const resultPost = await createPost(body);
                if (resultPost) {
                  setPosts([...posts, resultPost]);
                }
                if (resultPost) {
                  await triggerResponse(body, resultPost);
                }
                setBody("");
              }
            }}
            className="flex items-center space-x-3"
          >
            <input
              autoFocus
              id="message"
              name="message"
              placeholder="Write a message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 h-12 px-3 rounded bg-[#222226] border border-[#222226] focus:border-[#222226] focus:outline-none text-white placeholder-white"
            />
            <button
              type="submit"
              className="bg-[#222226] rounded h-12 font-medium text-white w-24 text-lg border border-transparent hover:bg-[#363739] transition"
              disabled={!body || !ceramic.did}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
