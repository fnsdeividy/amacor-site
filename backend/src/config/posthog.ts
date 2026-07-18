import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY || '', {
  host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  enableExceptionAutocapture: true,
});

process.on('SIGINT', async () => {
  await posthog.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await posthog.shutdown();
  process.exit(0);
});

export default posthog;
