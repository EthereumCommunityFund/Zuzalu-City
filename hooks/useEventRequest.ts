import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation } from '@tanstack/react-query';

const query = `
          mutation UpdateEvent($i: UpdateEventInput!) {
            updateEvent(input: $i) {
              document {
                id
              },
            }
          }
        `;

const useEventRequest = () => {
  const { composeClient } = useCeramicContext();

  const updateEventPass = useMutation({
    mutationFn: ({ eventId, pass }: { eventId: string; pass: string }) => {
      const variables = {
        i: {
          id: eventId,
          content: {
            checkinPass: pass,
          },
        },
      };
      return composeClient.executeQuery(query, variables);
    },
  });

  return { updateEventPass };
};
export default useEventRequest;
