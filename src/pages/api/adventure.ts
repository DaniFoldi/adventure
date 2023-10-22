import { Ai } from '@cloudflare/ai'
import type { APIRoute } from 'astro'


export const prerender = false

async function prime(ai: unknown) {
  const id = Math.floor(Math.random() * 1000000)
  const messages = [{ role: 'system', content: `The user is playing a text-based adventure game. Each game is different, this is game ${id}. Your first job is to create a short background story in 3-4 sentences.` }]
  const { response } = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages })

  return [ ...messages, { role: 'assistant', content: response }, { role: 'system', content: 'From now on, each of your messages will be responses to the user interaction. State three short options (A, B, C). The user responses will be the chosen action. Your responses should end by asking the user about their choice.' }]
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.runtime) {
    return Response.json([])
  }
  const ai = new Ai(locals.runtime.env.AI)

  const input = await request.json()

  const messages = input.length === 0 ? await prime(ai) : input

  const { response } = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages })

  return Response.json([ ...messages, { role: 'assistant', content: response.replace(/^Great[!,] .*?\n/s, '').trim() }])
}
