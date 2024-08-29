'use client'

import {useState} from 'react'
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Paper,
    CardActionArea,
} from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import db from '@/firebase'


export default function Generate(){

    const [text,setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const {isLoaded,isSignedIn,user}=useUser()
    const [flipped,setFlipped]=useState([])
    const [name,setName]=useState('')
    const [open,setOpen]=useState(false)
    const router= useRouter()


    const handleSubmit = async () => {
        // implement
        if (!text.trim()){
            alert('Please enter some text to generate flashcards')
            return
        }

        try{
            const response = await fetch('/api/generate',{
                method:'POST',
                body:text,
            })


            if (response.ok){
                throw new Error('Failed to generate flashcards')
            }

            const data= await response.json()

            setFlashcards(data)
        } catch(error){
            console.log("Error generating flashcards",error)
            alert("An error occurred while generating flashcards. please try again.")
        }
    }

    const handleClick=(id) =>{
        setFlipped((prev)=>({
            ...prev,
            [id]:!prev[id],
        }))
    }

    const handleOpen = () =>{
        setOpen(true)
    }


    const handleClose = () =>{
        setOpen(false)
    }

    const saveFlashcards = async ()=>{

        if(!name){
            alert("Please enter a name")
            return 
        }

        const batch = writeBatch(db)
        const userDocRef= doc(collection(db,'users'),user.id)
        const docSnap= await getDoc(userDocRef)

        if (docSnap.exists()){
            const collections=docSnap.data().flashcards || []

            if(collections.find((f)=> f.name==name)){

                alert("FlashCard collection with the same name already exists.")
                return 
            }else{
                collections.push({name})
                batch.set(userDocRef,{flashcards:collections},{merge:true})

            }
        }else{
            batch.set(userDocRef,{flashcards:[{name}]})
        }

        const colRef=collection(userDocRef,name)
        flashcards.forEach((flashcard)=>{
            const cardDocRef= doc(colRef)
            batch.set(cardDocRef,flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
        

    }

    return (
        <Container maxWidth="md">
            <Typography>Hello</Typography>
             <Box sx={{my:4,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
             }}>
            <Typography variant="h4" component="h1" gutterBottom>
                    Generate Flashcards
                </Typography>
                <Paper sx={{p:4, width:'100%'}}/>
                
                <TextField
                    value={text}
                    onChange={(e)=> setText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Enter text"
                    sx={{my:2}}
                    /> 
                <Button variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                > Submit</Button>  
            </Box> 

            {/* flash card display to be added here */}

            {flashcards.length>0 && (
                <Box sx={{mt:4}}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        flashCards Preview
                    </Typography>

                    <Grid container spacing={3}>
                        {flashcards.map((flashcard,index)=>(
                            <Grid item key={index} md={4} xs={12} sm={6}>
                                <Card>
                                    <CardActionArea
                                    onClick={()=>{
                                        handleClick(index)
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
                                            '& > div':{
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
                                            '& > div > div:':{
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
                </Box>
            )}



        </Container>
    )
}