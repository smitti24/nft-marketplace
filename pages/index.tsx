import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>The Slime Balls</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="">Welcome to the Slime Balls</h1>
    </div>
  );
};

export default Home;
