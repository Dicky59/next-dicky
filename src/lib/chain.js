import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define the output schema
const SummarySchema = z.object({
  summary: z.string().describe("A comprehensive summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("A list of interesting or notable facts about the repository")
});

// Initialize the LLM
const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// Create the structured LLM with output parsing
const structuredLlm = llm.withStructuredOutput(SummarySchema, {
  method: "json_schema"
});

// Create the prompt template
const summaryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an expert at analyzing GitHub repositories. Your task is to summarize the repository based on the README content provided and extract interesting facts about it."
  ],
  [
    "human",
    `Summarize this GitHub repository from this README file content:

{readmeContent}

Please provide:
1. A comprehensive summary of what this repository is about, its purpose, and main features
2. A list of cool/interesting facts about the repository (technologies used, unique features, notable aspects, etc.)

Format your response as a JSON object with "summary" and "cool_facts" fields.`
  ]
]);

// Create the chain
const summaryChain = summaryPrompt.pipe(structuredLlm);

// Function to generate repository summary
export async function generateRepositorySummary(readmeContent) {
  try {
    const result = await summaryChain.invoke({
      readmeContent: readmeContent
    });
    return result;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}
