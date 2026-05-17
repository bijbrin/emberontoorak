import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 15;

export async function GET() {
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Australia/Melbourne' })
  );
  const hour = now.getHours();
  const day = now.toLocaleDateString('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'long',
  });
  const timeOfDay =
    hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system:
      'You are the warm, sophisticated AI concierge for Ember on Toorak — a fire-driven fine dining restaurant in Melbourne. Write a short welcoming message of the day (2 sentences max). Reference the day or time of day naturally. Evoke the theatre of fire and luxury dining atmosphere. Never use quotes or greetings like "Good evening" — start with something unexpected and elegant. End the second sentence with a natural, unhurried invitation for the guest to secure their table tonight. No emojis. No URLs.',
    prompt: `Today is ${day} ${timeOfDay} in Melbourne. Write the chat widget greeting message of the day.`,
    maxOutputTokens: 100,
  });

  return Response.json({ greeting: text });
}
