import { Container } from "@/src/common/components/layout/Container";
import { Layout } from "@/src/common/components/layout/Layout";


import { NextPage } from "next";
import Head from "next/head";

const AboutPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            
            <Container>
                <h1>it's about</h1>
            </Container>
            
        </>
    )
}

export default AboutPage;