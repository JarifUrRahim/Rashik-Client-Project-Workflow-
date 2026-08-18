import { invokeLLM } from "../server/_core/llm";
import { buildAwakeMessages } from "../server/awake-policy";

async function main() {
  const response = await invokeLLM({
    model: "claude-haiku-4-5",
    messages: buildAwakeMessages([{ role: "user", content: "একটি সিদ্ধান্ত নেওয়ার আগে থামা কেন কাজে লাগে? এক বাক্যে বলুন।" }], "bn"),
  });
  const text = response.choices[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("Bangla aWake smoke test received no text");
  const hasBangla = /[\u0980-\u09FF]/.test(text);
  console.log(JSON.stringify({ ok: hasBangla, responseLength: text.trim().length }));
  if (!hasBangla) process.exitCode = 1;
}

void main();
