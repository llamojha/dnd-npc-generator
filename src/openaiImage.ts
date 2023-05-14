import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const openaiImage = async (
  apiKey: string,
  context: string
): Promise<string | undefined> => {
  try {
    const messages: ChatCompletionRequestMessage[] = [];
    const contextPath = "./context";
    let prompt = "Portrait of a human, fantasy, dnd";
    const model = "gpt-3.5-turbo";
    //const model = "gpt-4";
    const nImages = 1;
    // Set up OpenAI API credentials
    apiKey = process.env.REACT_APP_OPENAI_API_KEY || apiKey;
    if (!apiKey) {
      throw new Error("OpenAI API key not found.");
    } // Define the prompt for GPT-3 5x Turbo

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    // get Prompt

    // Initial mission
    if (messages.length === 0) {
      const fileResponseInit = await fetch(`${contextPath}/missionImage.json`);
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

    const completion = await openai.createChatCompletion({
      model: model,
      messages: messages,
      //temperature: 0,
    });

    if (completion.data.choices[0].message) {
      prompt = completion.data.choices[0].message.content;
    }
    const response = await openai.createImage({
      prompt: prompt,
      n: nImages,
      size: "256x256",
      response_format: "url",
    });
    console.log(`Response image for prompt ${prompt} received`);

    // Transfer images to S3
    const responseData = response.data.data;
    //const responseDataJson = await responseData.json();
    //console.log(imagesData);
    const imagesUrl = responseData.map((imageData) => imageData.url);

    if (imagesUrl[0] !== undefined) {
      return imagesUrl[0];
    } else {
      return "https://via.placeholder.com/500";
    }
  } catch (error) {
    console.error(error);
    return "https://via.placeholder.com/404";
  }
};

export default openaiImage;
