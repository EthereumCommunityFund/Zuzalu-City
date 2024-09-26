export const getSpaceEventsQuery = (eventCount: number = 10) => `
      query GetSpaceEvents($id: ID!) {
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

export const getSpacesQuery = `
      query GetSpaces {
        zucitySpaceIndex(first: 30) {
          edges {
            node {
              admins {
                id
              }
              avatar
              banner
              category
              description
              discord
              ens
              gated
              github
              id
              lens
              name
              nostr
              superAdmin {
                id
              }
              tagline
              telegram
              twitter
              website
            }
          }
        }
      }
      `;
