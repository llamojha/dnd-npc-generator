import { ChatCompletionRequestMessage } from "openai";
import openaiSender from "./openaiSender";

export const messages: ChatCompletionRequestMessage[] = [];
export const UpdateCDKmessages: ChatCompletionRequestMessage[] = [];
const contextPath = "./context";

const requestMessage = async (
  apiKey: string,
  context: string,
  mission: string
): Promise<string | undefined> => {
  try {
    // Initial mission
    if (messages.length === 0) {
      const fileResponseInit = await fetch(`${contextPath}/mission.json`);
      const fileContentsInit = await fileResponseInit.json();
      messages.push({
        role: fileContentsInit.role,
        content: fileContentsInit.content,
      });
    }

    // Give context
    if (!context) {
      context =
        "From the given context, Please provide a background story for a dungeons and dragons NPC character";
    }
    messages.push({ role: "user", content: context });

    //const missions = ["background", "appearance", "other", "stats", "name", "race", "alignment"];
    // Get Mission
    const fileResponse = await fetch(`${contextPath}/${mission}.json`);
    const fileContents = await fileResponse.json();
    messages.push({
      role: fileContents.role,
      content: fileContents.content,
    });

    const message = await openaiSender(apiKey, messages);
    if (message) {
      messages.push(message);
    } else {
      throw new Error("openaiSender returned undefined");
    }

    //Get assistant content
    let lastAssistantMessage = messages
      .slice()
      .reverse()
      .find((message) => message.role === "assistant");

    let output = "";
    if (lastAssistantMessage) {
      output = lastAssistantMessage.content;
    }

    return output;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default requestMessage;
