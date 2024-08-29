import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt=`
you are a flashcard creator. Your task is to generate flashcards based on given prompts.
 Each prompt will consist of a question and an answer. You should generate a flashcard 
 that includes the question and the answer. The answer should be a concise and accurate
  response to the question. Remember to provide clear and informative flashcards that are
   easy to understand.Follow this guidelines.
    1.Include relevant examples or illustrations in the flashcards
    2. Ensure the flashcards cover a wide range of topics
    3. Use simple and concise language in the flashcards
    4. Provide explanations or definitions for any technical terms used
    5. Organize the flashcards in a logical and easy-to-navigate manner
    6. return a flashcard with the question and answer.
    7. Only generate 10 flashcards if not stated in the user data text message.

    Return in the following JSON format:
    {
    "flashcards":
        [
            {
             "fronts":str,
             "back":str
             },
        ]
    }
   
`

export async function POST(req){
    const openai=OpenAI();
    const data= await req.text();

    const completion = await openai.chat.completion.create({

        model:"gpt-3.5-turbo",
        response_format:{ type:"json_object"},
        messages:[
            {
                role:"system",
                content:systemPrompt
            },
            {
                role:"user",
                content:data
            }
        ],

    })

    const flashcards= JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcard)

}