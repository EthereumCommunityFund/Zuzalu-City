export const getSpaceQuery = (eventCount: number = 10) => `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
            avatar
            banner
            description
            name
            profileId
            tagline
            website
            twitter
            telegram
            nostr
            lens
            github
            discord
            ens
            admins {
              id
            }
            superAdmin{
              id 
            }
            events(first: ${eventCount}) {
              edges {
                node {
                  createdAt
                  description
                  endTime
                  external_url
                  gated
                  id
                  image_url
                  max_participant
                  meeting_url
                  min_participant
                  participant_count
                  profileId
                  spaceId
                  startTime
                  status
                  tagline
                  timezone
                  title
                }
              }
            }
          }
        }
      }
      `;
