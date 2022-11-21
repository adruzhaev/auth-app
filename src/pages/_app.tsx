import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return <>
        <Head>
            <title>Authentication App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/images/favicon.ico" />
        </Head>

        <Component {...pageProps} />;
    </>;
}
