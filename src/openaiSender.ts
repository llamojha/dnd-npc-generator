import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const openaiSender = async (
  apiKey: string,
  messages: ChatCompletionRequestMessage[]
): Promise<ChatCompletionRequestMessage | undefined> => {
  try {
    //const model = "gpt-4";
    const model = "gpt-3.5-turbo";
    // Set up OpenAI API credentials
    apiKey = process.env.REACT_APP_OPENAI_API_KEY || apiKey;
    if (!apiKey) {
      throw new Error("OpenAI API key not found.");
    } // Define the prompt for GPT-3 5x Turbo

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: model,
      messages: messages,
      //temperature: 0,
    });

    if (completion.data.choices[0].message && completion.data.usage) {
      //console.log(completion.data.choices[0].message.content);
      //const prompt_tokens = completion.data.usage?.prompt_tokens;
      //const completion_tokens = completion.data.usage?.completion_tokens;
      const total_tokens = completion.data.usage?.total_tokens;
      //console.log(`Usage prompt tokens: ${prompt_tokens}`);
      //console.log(`Usage complation tokens: ${completion_tokens}`);
      console.log(`Usage total tokens: ${total_tokens}`);

      return completion.data.choices[0].message;
    } else {
      return { role: "system", content: "Error" };
    }
  } catch (error) {
    console.error(error);
    if (typeof error === "string") {
      return { role: "system", content: error };
    } else if (error instanceof Error) {
      return { role: "system", content: error.message };
    }
  }
};

export default openaiSender;
