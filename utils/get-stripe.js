import { loadStripe } from "@stripe/stripe-js";

let stringPromise

const getStripe = () =>{
    if(!stringPromise){
        stringPromise= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    }
    return stringPromise
}


export default getStripe