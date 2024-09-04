import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
let conversation = null;

export function initializeChat(message){
    const apiKey=process.env.GOOGLE_API_KEY
    const gemini= new GoogleGenerativeAI({
        apiKey:apiKey,
    })
    const model= gemini.getGenerativeModel({
        model:'gemini-pro'
    })
    console.log("Intializing chat.")


    const initHistory=[
        {
            role:'user',
           parts:[message]
        },
        {
            role:'model',
            parts:'Hello. what kind of flashcards would you like me to generate for you?'

        }
    ];
    if(!model){
        console.log("failed to initalize model")
        return null;
    }
    try{

    conversation= model.startChat(
        initHistory
        
    )
    conversation._apiKey=null;
    console.log("got the conversations")
    return conversation;
    } catch(error){
        console.log(error)
    }

}



export async function sendMessage(message){
    console.log("SEND MESSAGE")

    const apiKey=process.env.GOOGLE_API_KEY;
    // console.log(conversation)
    console.log("inside send message helper")

    if (!conversation){
        console.log("conversion error inside send message ")
        return {
            text:"something went wrong conversion is empty",
            conversation:null
        }
    }

    try{
        conversation._apiKey=apiKey;

        const result=await conversation.sendMessage(message);
        const response = await result.response.text();
        const flashcards= JSON.parse(response).flashcards;
        // console.log("flashcards", flashcards)
        // console.log("conversation", conversation)
       
        return {
            flashcards:flashcards,
            conversation:conversation
        }
    }
    catch(error){
        return {
            flashcards:[],
            conversation:conversation
        }
    }
}