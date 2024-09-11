'use client'

const { Container, CircularProgress, Typography, Box } = require("@mui/material")
const { useRouter, useSearchParams } = require("next/navigation")
const { useState, useEffect } = require("react")



const ResultPage=()=>{
    const router=useRouter()
    const searchParams= useSearchParams()
    const session_id= searchParams.get('session_id')

    const [loading,setLoading]= useState(true)
    const [session,setSession]=useState(null)
    const [error,setError]= useState(null)


    useEffect(()=>{

        const fetchCheckoutSession= async ()=>{

            if(!session_id){
                return
            }

            try{
                const res= await fetch(`/api/checkout_session?session_id=${session_id}`)

                const sessionData= await res.json()

                if(res.ok){
                    setSession(sessionData)
                } else{
                    setError(sessionData.error)
                }
            } catch(error){
                setError("An error occured while retriving the session.")
            } finally{
                setLoading(false)
            }

            
        }
        fetchCheckoutSession()
    },[session_id])



    if (loading){
        return (
            <Container maxWidth="100vw"
            sx={{mt:4, textAlign:'center'}}>
                <CircularProgress />
                <Typography variant="h6" sx={{mt:2}}>
                    Loading ...
                </Typography>
            </Container>
        )
    }


    if (error){
        return (
            <Container maxWidth="sm"
            sx={{mt:4, textAlign:'center'}}>
                <CircularProgress />
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        )

    }



    return (
        <Container maxWidth="sm" sx={{textAlign:'center', mt:4}}>
            {session.payment_status==='paid' ?
            (<>
            <Typography variant="h4">Thank you for your Purchase!</Typography>
            <Box sx={{mt:2}}>
                <Typography variant="h6">
                    Session ID:{session_id}
                </Typography>
                <Typography variant="body1">
                We have received your payment. You will receive an email with the
                order details shortly.
                </Typography>
            </Box>
            </>)
            :
            (<>
            <Typography variant="h4" color="error"> Payment Failed</Typography>
            <Box sx={{mt:2}}>
                <Typography variant="body1">
                Your payment was not successful. Please try again.
                </Typography>
            </Box>
            </>)}
        </Container>
    )
}

export default ResultPage