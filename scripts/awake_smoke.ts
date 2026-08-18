import { invokeLLM } from "../server/_core/llm";
import { buildAwakeMessages } from "../server/awake-policy";

async function main() {
  const response = await invokeLLM({
    model: "claude-haiku-4-5",
    messages: buildAwakeMessages([{ role: "user", content: "Give one concise sentence about pausing before a decision." }]),
  });
  const choice = response.choices[0];
  const text = choice?.message?.content;
  console.log(JSON.stringify({
    hasText: typeof text === "string" && text.trim().length > 0,
    finishReason: choice?.finish_reason ?? null,
    contentType: typeof text,
    refusal: (choice?.message as { refusal?: unknown } | undefined)?.refusal ?? null,
  }));
  if (typeof text !== "string" || !text.trim()) process.exitCode = 1;
}

void main();
