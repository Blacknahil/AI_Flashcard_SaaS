'use client'
import db from "@/firebase"
import { useRouter } from "next/navigation"
import {use,useState,useEffect} from 'react'
import { useUser } from "@clerk/nextjs"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"


export default function FlashCards(){
    const {isLoaded,isSignedIn,user}= useUser()
    const router= useRouter()
    const [flashcards,setFlashcards]=useState([])



    useEffect(()=>{
        async function getFlashcards(){

            if(!user|| !isSignedIn){
                alert("Please sign in to view flashcards")
                return
            }
            const docRef=doc(collection(db,'users'),user.id)
            const docSnap= await getDoc(docRef)

            if(docSnap.exists){
                const collections= docSnap.data().flashcards ||[]
                setFlashcards(collections)

            }else{
                await setDoc(docRef,{flashcards:[]})
            }
                }
        getFlashcards()
    },[user,isSignedIn])


    if(!isLoaded || !isSignedIn){
       return <>
       <Typography variant="h5">Could not load flash cards</Typography>
       </>

    }

    const handleCardClick=(id)=>{
        console.log(`flash card for ${id}`)
        router.push(`/flashcard?id=${id}`)  
    }


    return <Container maxWidth="100vw">
        <Grid container spacing ={3} sx={{mt:4}}>
            {flashcards.map((flashcard,index)=>
                (<Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={()=>{
                            console.log("calling flashcard click")
                            handleCardClick(flashcard.name)
                        }
                            
                        }>
                                                    <CardContent>
                            <Typography variant="h6" component="div">
                                {flashcard.name} 
                            </Typography>
                        </CardContent>
                        </CardActionArea>

                    </Card>

                </Grid>)
            )}
        </Grid>
    </Container>
}