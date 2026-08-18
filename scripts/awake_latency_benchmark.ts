import { invokeLLM } from "../server/_core/llm";
import { buildAwakeMessages } from "../server/awake-policy";

async function measure(model: string) {
  const started = Date.now();
  const response = await invokeLLM({
    model,
    messages: buildAwakeMessages([{ role: "user", content: "I feel uncertain about a decision. Give one calm next step in one sentence." }]),
  });
  const content = response.choices[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error(`${model} returned no text`);
  return { model, milliseconds: Date.now() - started, responseLength: content.trim().length };
}

async function main() {
  const results = [];
  for (const model of ["gpt-5-nano", "gpt-5-mini", "claude-haiku-4-5"]) {
    results.push(await measure(model));
  }
  console.log(JSON.stringify(results));
}

void main();
