/**
 * OpenRouter (InsForge Model Gateway) provider adapter — calls OpenRouter's
 * OpenAI-compatible completions API, translating canonical types.
 *
 * Auth: reads OPENROUTER_API_KEY from environment.
 */

import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { ExternalServiceError, RuntimePolicyError } from "../_core/errors";
import { logger } from "../_core/logger";
import type { InvokeParams, InvokeResult, Message } from "../_core/llm";
import type { LLMProvider, ProviderInvokeOptions } from "../_core/providers";

/* ─── Pricing (per 1M tokens, USD) ─────────────────────────────────────── */
const OPENROUTER_PRICING: Record<string, { prompt: number; completion: number }> = {
  "google/gemini-2.5-flash": { prompt: 0.075, completion: 0.3 },
  "openai/gpt-4o-mini": { prompt: 0.15, completion: 0.6 },
  default: { prompt: 0.15, completion: 0.6 },
};

export async function invokeOpenRouter(
  params: InvokeParams,
  apiKey: string,
  options: ProviderInvokeOptions = {},
): Promise<InvokeResult> {
  if (options.killSwitchActive) {
    throw new RuntimePolicyError("LLM API request blocked by RakshEx Kill Switch.", {
      context: { policy: "kill_switch" },
    });
  }

  const model = options.model ?? "google/gemini-2.5-flash";

  const payload: Record<string, unknown> = {
    model,
    messages: params.messages,
    max_tokens: params.maxTokens ?? params.max_tokens ?? 8192,
  };

  if (params.tools && params.tools.length > 0) {
    payload.tools = params.tools;
  }

  const toolChoice = params.toolChoice ?? params.tool_choice;
  if (toolChoice && toolChoice !== "none") {
    payload.tool_choice = toolChoice;
  }

  const fmt = params.responseFormat ?? params.response_format;
  const schema = params.outputSchema ?? params.output_schema;
  if (fmt) {
    payload.response_format = fmt;
  } else if (schema) {
    payload.response_format = {
      type: "json_schema",
      json_schema: { name: schema.name, schema: schema.schema },
    };
  }

  const url = "https://openrouter.ai/api/v1/chat/completions";
  const response = await fetchWithTimeout(url, {
    method: "POST",
    timeoutMs: 60_000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://yc7y9pq9.ap-southeast.insforge.app",
      "X-Title": "RakshEx",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ExternalServiceError(
      `OpenRouter invoke failed (${model}): ${response.status} ${response.statusText}`,
      {
        safeMessage: "AI request via OpenRouter failed. Please try again.",
        context: { provider: "openrouter", model, status: response.status, body: errorText },
      },
    );
  }

  const result = (await response.json()) as InvokeResult;

  // Auto-track token usage
  if (options.userId && result.usage) {
    const pricing = OPENROUTER_PRICING[model] ?? OPENROUTER_PRICING["default"];
    const cost =
      (result.usage.prompt_tokens / 1_000_000) * pricing.prompt +
      (result.usage.completion_tokens / 1_000_000) * pricing.completion;

    import("../db").then(async (db) => {
      try {
        await db.recordTokenUsage(
          options.userId!,
          model,
          result.usage!.prompt_tokens,
          result.usage!.completion_tokens,
          0,
          cost,
        );
      } catch (err) {
        logger.warn({ err }, "[OpenRouter] Failed to record token usage");
      }
    });
  }

  return result;
}

export const openrouterProvider: LLMProvider = {
  name: "openrouter",
  defaultModel: "google/gemini-2.5-flash",

  async invoke(params: InvokeParams, options?: ProviderInvokeOptions): Promise<InvokeResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new ExternalServiceError("OpenRouter API key (OPENROUTER_API_KEY) not configured.", {
        safeMessage: "OpenRouter AI Gateway is not configured. Please contact support.",
      });
    }
    return invokeOpenRouter(params, apiKey, options);
  },

  supportsModel: (model: string) =>
    model.includes("/") ||
    model.startsWith("gpt-") ||
    model.startsWith("claude-") ||
    model.startsWith("gemini-"),

  supportsVision: () => true,
  supportsPromptCaching: () => true,
};
