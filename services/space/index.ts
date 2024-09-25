export const getSpaceQuery = (eventCount: number = 10) => `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on ZucitySpace {
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
                  externalUrl
                  gated
                  id
                  imageUrl
                  maxParticipant
                  meetingUrl
                  minParticipant
                  participantCount
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
