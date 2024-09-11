'use client'

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
    },[session_id]
)
}