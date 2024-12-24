export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello, World! This is a test Netlify serverless function.",
      eventDetails: event,
      contextDetails: context,
    }),
  };
}
