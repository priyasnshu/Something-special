/* Optional Cloudflare Pages Functions adapter.
   Deploying the same project on Cloudflare Pages exposes POST /api/feedback.
   It reuses the exact Worker handler from ../.. /worker.js. */
import { handleFeedback } from '../../worker.js';

export async function onRequest(context){
  return handleFeedback(context.request, context.env);
}
