export async function fetchEmailJsConfig() {
  try {
    const configRes = (await (
      await fetch('/api/emailService')
    ).json()) as unknown as {
      serviceId: string;
      templateId: string;
      userId: string;
    };

    return {
      serviceId: configRes.serviceId,
      templateId: configRes.templateId,
      userId: configRes.userId,
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
}
