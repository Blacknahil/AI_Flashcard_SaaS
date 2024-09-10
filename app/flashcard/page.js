'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect,useState } from "react"
import db from "@/firebase"
import { collection,doc,getDoc,getDocs,setDoc } from "firebase/firestore"
import { useSearchParams } from "next/navigation"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"


export default function Flashcard(){

    const [flashcards,setFlashcards]= useState([])
    const [flipped, setFlipped]= useState({})
    const {isLoaded,isSignedIn,user}=useUser()

    const searchParams=useSearchParams()
    const search= searchParams.get('id')

    useEffect(()=>{
        async function getFlashcard(){

            if(!search||!user){
                alert("Please sign in to view flashcard")
                return
            }
            const colRef=collection(doc(collection(db,'users'),user.id),search)
            console.log("col ref", colRef)
            const docs= await getDocs(colRef)
            const flashcards=[]
            console.log("docs",docs)
            

            docs.forEach((doc)=>{
                flashcards.push({ id:doc.id, ...doc.data()})
            })
            console.log("flashcards",flashcards)
            
            setFlashcards(flashcards)
        }

        getFlashcard()
    },[user,search])


    const handleCardClick=(id) =>{
        setFlipped((prev)=>({
            ...prev,
            [id]:!prev[id],
        }))
    }

    if(!isSignedIn){
        return <Typography>Authentication Error</Typography>

    }


    return (
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{mt:4}}>
                    {flashcards.map((flashcard,index)=>(
                        <Grid item key={index} md={4} xs={12} sm={6}>
                            <Card>
                                <CardActionArea
                                onClick={()=>{
                                    handleCardClick(index)
                                }}
                                >
                                <CardContent>
                                    <Box sx={{
                                        perspective:"1000px",
                                        '& > div':{
                                            transition:'transform 0.6s',
                                            transformStyle:'preserve-3d',
                                            position:'relative',
                                            width:'100%',
                                            height:'200px',
                                            boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transform:flipped[index] ? 'rotateY(180deg)':'rotateY(0deg)',
                
                                        },
                                        '& > div > div':{
                                            position:'absolute',
                                            width:'100%',
                                            height:'100%',
                                            backfaceVisibility:'hidden',
                                            display:'flex',
                                            justifyContent:'center',
                                            alignItems:'center',
                                            padding:2,
                                            boxSizing:'border-box',
                
                                        },
                                        '& > div > div:nth-of-type(2)':{
                                            transform:'rotateY(180deg)',
                
                                        }


                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5"
                                                component="div"
                                                >{flashcard.front}</Typography>
                                            </div>

                                            <div>
                                                <Typography variant="h5"
                                                component="div"
                                                >{flashcard.back}</Typography>
                                            </div>

                                        </div>
                                    </Box>


                                </CardContent>

                                </CardActionArea>


                            </Card>
                            </Grid>
                    ))}

                </Grid>
        </Container>
    )


}
