import { SignIn } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpPage(){

    return (
        <Container maxWidth="md">
            <AppBar position="static" >

                <Toolbar>
                <Typography varaint="h6" sx={{flexGrow:1}}>
                    Flashcard SaaS
                </Typography>
                <Button color="inherit">
                    <Link href="/sign-in" passHref >
                    <Typography color="white">Login</Typography>
                    
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                    <Typography color="white">Sign Up</Typography>
                    </Link>
                </Button>
                </Toolbar>
            </AppBar>

            <Box display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
                <Typography variant="h4" marginY={2}> Sign In</Typography>
                <SignIn />
            </Box>
        </Container>
    )
}