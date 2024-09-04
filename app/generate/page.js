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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
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
    const [conversation, setConversation] = useState('');


    const handleSubmit = async () => {
        // implement
        console.log("handle submit",flashcards)
        if (!text.trim()){
            
            alert('Please enter some text to generate flashcards')
            return
        }

        try{
            const response = await fetch('/api/generate',{
                method:'POST',
                body:JSON.stringify({
                    message:text,
                    conversation:conversation
                })
            })

            const data = await response.json();

            console.log("Response Data:", data);
            console.log("response flashcards", data.flashcards)
            console.log("response converation", data.conversation)

            // Update the flashcards and conversation state
            setFlashcards(data.flashcards);
            setConversation(data.conversation);
            setText('');
            console.log("conversation after",conversation)
            console.log("text after", text)
            console.log("flashcards after", flashcards)
            console.log("") // Update conversation object

            // Optionally, clear the text input after submission
            
        } catch(error){
            console.log("Error generating flashcards",error)
            alert("An error occurred while generating flashcards. please try again.",error)
        }
    }

    const handleCardClick=(id) =>{
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
    console.log("flashcards", flashcards)
    return (
        

        <Container maxWidth="md">
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
                > Generate</Button>  
            </Box> 

            {/* </Container> */}

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

                    <Box sx={{mt:4, display:'flex', justifyContent:'center'}}
                    >
                            <Button variant="contained" color="secondary"
                            onClick={handleOpen}>
                                Save flashcards
                            </Button>
                    </Box>
                </Box>
            )}



        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText> 
                    Please enter a name for your flashcards collection
                </DialogContentText>
                <TextField autoFocus
                margin='dense'
                label="Collection Name"
                type='text'
                fullWidth
                value={name}
                onChange={(e)=> setName(e.target.value)}
                variant="outlined"
                ></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={saveFlashcards}>Save</Button>
            </DialogActions>
        </Dialog>


        </Container>
    )
}