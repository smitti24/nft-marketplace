import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { sanityClient, urlFor } from "../sanity";
import { Collection } from "../typings";

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-screen py-20 px-10 2xl:px-0">
      <Head>
        <title>Smitties NFT Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-10 text-4xl font-extralight">
        <span className="font-extrabold underline decoration-pink-600/50">
          Smitties
        </span>{" "}
        NFT Marketplace
      </h1>

      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20 ">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
                <img
                  className="h-96 w-60 rounded-2xl object-cover"
                  src={urlFor(collection.mainImage).url()}
                  alt=" /"
                ></img>
                <div className="p-5 text-center">
                  <h2 className="text-3xl">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
    _id, 
    _type, 
  title,
    description,
    address,
    nftCollectionName,
    mainImage {
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator -> {
    _id,
    name,
    address,
    slug {
    current
  },
  }
  } 
  `;

  const collections = await sanityClient.fetch(query);

  return {
    props: {
      collections,
    },
  };
};
