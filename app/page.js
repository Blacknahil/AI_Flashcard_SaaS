'use client'
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography,
  Button,Box,
  Grid,
 } from "@mui/material";
import Head from "next/head";
import { useRouter } from 'next/navigation'


export default function Home() {
  const router= useRouter()
  const {isLoaded,isSignedIn,user}=useUser()


  const handleGetStarted = async=>{

    if (!isSignedIn){
      alert("Please sign in to Generate flashcards")
      return 
    }
    router.push('/generate')


  }

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  



  return (
    <Container>
      <Head>
        <title>FlashCard Saas</title>
        <meta name="description" content="Create flashcards from your texts."></meta>
      </Head>

      <AppBar>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow:1}}> FlashCard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      {/* Hero section */}
      <Box sx={{textAlign:'center',my:12,}}>
        <Typography variant="h2"> Welcome to FlashCard SaaS</Typography>
        <Typography variant="h5">The easist way to make flashcards from your text.</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} 
        onClick={handleGetStarted}
        > {isSignedIn?"Genrate Flashcards":"Get Started"}</Button>
      </Box>

      {/* feature section */}
      <Box>
        <Grid container spacing={4}>

          <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Easy Text input</Typography>
          <Typography>Simply input your text and let our software do the rest.
            Creating flashcards has never been easier.
          </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
          <Typography>Our AI intelligently breaks down your text into 
            concise flashcards, perfect for studying.
          </Typography>
          </Grid>


          <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
          <Typography>Access your flashcards from 
            any device, at any time. Study on the go with ease.
          </Typography>
          </Grid>

        </Grid>
      </Box>

      {/* Pricing section */}

      <Box sx={{my:6, textAlign:"center"}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p:4,
              border:"1px solid",
              borderColor:"grey.300",
              borderRadius:2,
            }} >
              <Typography variant="h5" gutterBottom > Basic</Typography>
              <Typography variant="h6" gutterBottom> $5/ month</Typography>
              <Typography sx={{mb:2}}> Access to basic flashcard features and limited storage.</Typography>

              <Button variant="contained" color="primary">Choose basic</Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              p:4,
              border:"1px solid",
              borderColor:"grey.300",
              borderRadius:2,
            }} >
              <Typography variant="h5" gutterBottom > Pro</Typography>
              <Typography variant="h6" gutterBottom> $10/ month</Typography>
              <Typography sx={{mb:2}}> Unlimited flashcards and storage, with priority support.</Typography>

              <Button variant="contained" color="primary" sx={{mt:2}}
              onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>




        </Grid>

      </Box>
    </Container>
  )
}