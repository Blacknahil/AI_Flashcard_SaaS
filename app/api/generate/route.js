

import { NextResponse } from 'next/server';
import { initializeChat, sendMessage } from './helper';

const systemPrompt=`
you are a flashcard creator. Your task is to generate flashcards based on given prompts. you dont 
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
console.log(typeof(systemPrompt));

export async function POST(req){

    const body= await req.json();
    console.log("request body", body)
    const {message,conversation}= body;
    
    console.log("GENERTE route ", conversation!=null)
    if (!conversation){
        console.log("New Conversation!")
        const newConversation = initializeChat(systemPrompt);

        console.log("returning nextreponse ")
        const {flashcards,conversation}= await sendMessage(systemPrompt + "\n" + message,newConversation)

        return NextResponse.json({
            flashcards : flashcards,
            conversation :conversation
        });
    }
    else{
        console.log("Post conversation",conversation)
        const {flashcards, newConversation} = await sendMessage(systemPrompt + "\n" + message, conversation);
        // console.log("got message from send message ");
        console.log("new conversation", newConversation)
        return NextResponse.json({
            flashcards:flashcards ,
            conversation:newConversation
        });

    }


}