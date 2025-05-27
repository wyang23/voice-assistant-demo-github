// route.js
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./prompt";

// Helper function to create a chunk for the stream response
const createChunk = (
  content,
  index,
  finish_reason = null,
  function_call = null
) => {
  const chunk = {
    choices: [
      {
        index,
        delta: { role: "assistant", content },
        finish_reason,
      },
    ],
  };

  // Add function call data if present
  if (function_call) {
    chunk.choices[0].delta.function_call = function_call;
  }

  return chunk;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Format the conversation history
    const currentHistory = messages
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    // Initialize the Google Generative AI with API key
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_GEMINI_API_KEY,
    });

    // Set up streaming response headers
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Start the Gemini stream using the updated API
          const result = await genAI.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: `${prompt}\n\n${currentHistory}\nassistant:`,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          });

          let index = 0;
          let tempBuffer = "";
          const adaptiveCardRegex = /<adaptiveCard>(.*?)<\/adaptiveCard>/gs;

          // Process the stream chunks
          for await (const chunk of result) {
            // Handle text content
            const chunkText = chunk.text;
            if (chunkText) {
              tempBuffer += chunkText;

              // Check for complete adaptive card tags
              if (
                tempBuffer.includes("<adaptiveCard>") &&
                tempBuffer.includes("</adaptiveCard>")
              ) {
                // Process and extract any complete adaptive cards
                let match;
                let lastIndex = 0;
                const processedBuffer = [];
                const regex = new RegExp(adaptiveCardRegex);

                while ((match = regex.exec(tempBuffer)) !== null) {
                  // Add text before the card
                  if (match.index > lastIndex) {
                    const textBefore = tempBuffer.substring(
                      lastIndex,
                      match.index
                    );
                    if (textBefore) {
                      const responseChunk = createChunk(textBefore, index);
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify(responseChunk)}\n\n`
                        )
                      );
                      index++;
                      processedBuffer.push(textBefore);
                    }
                  }

                  // Process the card JSON
                  try {
                    const cardJson = match[1];

                    try {
                      const parsedJson = JSON.parse(cardJson);

                      // Send the card as a function call
                      const functionCall = {
                        name: "render_adaptive_card",
                        arguments: JSON.stringify(parsedJson),
                      };

                      const responseChunk = createChunk(
                        "",
                        index,
                        null,
                        functionCall
                      );
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify(responseChunk)}\n\n`
                        )
                      );
                      index++;

                      // Add the processed card to our buffer
                      processedBuffer.push(
                        `<adaptiveCard>${cardJson}</adaptiveCard>`
                      );
                    } catch (e) {
                      console.error("Error parsing JSON after fixes:", e);
                      // If parsing still fails, just send the original card text
                      const rawText = match[0];
                      const responseChunk = createChunk(rawText, index);
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify(responseChunk)}\n\n`
                        )
                      );
                      index++;
                      processedBuffer.push(rawText);
                    }
                  } catch (e) {
                    console.error("Error processing adaptive card:", e);
                    // Just include the raw text if processing fails
                    const rawText = match[0];
                    const responseChunk = createChunk(rawText, index);
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify(responseChunk)}\n\n`
                      )
                    );
                    index++;
                    processedBuffer.push(rawText);
                  }

                  lastIndex = regex.lastIndex;
                }

                // Add any remaining text after the last card
                if (lastIndex < tempBuffer.length) {
                  const textAfter = tempBuffer.substring(lastIndex);
                  if (textAfter) {
                    const responseChunk = createChunk(textAfter, index);
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify(responseChunk)}\n\n`
                      )
                    );
                    index++;
                    processedBuffer.push(textAfter);
                  }
                }

                // Update the buffer to only include unprocessed content
                if (processedBuffer.length > 0) {
                  tempBuffer = tempBuffer.substring(lastIndex);
                }
              } else if (!tempBuffer.includes("<adaptiveCard>")) {
                // If no adaptive card tag is present, send the content directly
                const responseChunk = createChunk(chunkText, index);
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(responseChunk)}\n\n`)
                );
                index++;
                tempBuffer = ""; // Clear the buffer as we've processed all content
              }
              // If we have an opening tag but no closing tag yet, keep buffering
            }
          }

          // Process any remaining text in the buffer
          if (tempBuffer) {
            const responseChunk = createChunk(tempBuffer, index);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(responseChunk)}\n\n`)
            );
            index++;
          }

          // Send the final chunk to indicate completion
          const finalChunk = createChunk("", index, "stop");
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Error with Gemini API:", error);
          const errorChunk = createChunk(
            "Sorry, I encountered an error processing your request.",
            0,
            "stop"
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
