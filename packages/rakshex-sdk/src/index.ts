/**
 * RakshEx SDK — AI Runtime Telemetry
 *
 * Drop-in wrapper. Wraps your existing LLM provider calls and sends
 * telemetry (prompt, response, tokens, cost, latency) to RakshEx.
 *
 * Usage:
 *   import { RakshEx } from "@rakshex/sdk";
 *   const dp = new RakshEx({ apiKey: "dp_xxx", workspaceId: "ws_xxx" });
 *   const openai = dp.wrap(new OpenAI());
 *   const response = await openai.chat.completions.create({ ... });
 *   // Telemetry automatically captured and sent.
 */

export { RakshEx } from "./client.js";
export type { RakshExConfig, TelemetryEvent } from "./types.js";
export { redactPII } from "./telemetry/redact.js";
export { calculateCost } from "./telemetry/cost.js";

// Re-export wrappers
export { wrapOpenAI } from "./wrappers/openai.js";
export { wrapAnthropic } from "./wrappers/anthropic.js";
