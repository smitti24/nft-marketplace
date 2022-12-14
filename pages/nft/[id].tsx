import React, { useEffect, useState } from "react";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useWalletConnect,
  useNFTDrop,
  useContract,
} from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";
import { NFTMetadata } from "@thirdweb-dev/sdk";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  collection: Collection;
}

function NFTDropPage({ collection }: Props) {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, settotalSupply] = useState<BigNumber>();
  const [price, setPrice] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [claimedNFT, setClaimedNFT] = useState<NFTMetadata>();
  const nftDrop = useNFTDrop(collection?.address);

  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      const claimConditions = await nftDrop.claimConditions.getAll();

      setPrice(claimConditions?.[0].currencyMetadata.displayValue);
      setClaimedSupply(claimed.length);
      settotalSupply(total);

      setLoading(false);
    };

    fetchNFTDropData();
  }, [nftDrop]);

  const mintNFT = () => {
    if (!nftDrop || !address) return;
    setLoading(true);
    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });

    const quantity = 1;

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (txData) => {
        const reciept = txData[0].receipt;
        const claimedTokenId = txData[0].id;
        const claimedNFT = await txData[0].data();

        setClaimedNFT(claimedNFT?.metadata);
        toast("LETSGOOOOO, You minted!!!!", {
          duration: 8000,
          style: {
            background: "green",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        toast("Whoops", {
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  return (
    <div className="flex h-screen flex-col md:grid md:grid-cols-10">
      <Toaster position="bottom-center" />
      <div className="bg-gradient-to-br from-green-300 to-green-700 md:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-500 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={
                claimedNFT
                  ? claimedNFT?.image?.toString()
                  : urlFor(collection.previewImage).url()
              }
              alt=""
            />
          </div>

          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl text-white font-bold ">
              {collection?.title}
            </h1>
            <h2 className="text-xl text-gray-300">{collection?.description}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 md:col-span-6">
        <header className="flex items-center justify-between mb-4">
          <Link href={`/`}>
            <h1 className="w-52 cursor-pointer text-xl sm:w-80 flex-grow">
              <span className="font-extrabold underline decoration-pink-600/50">
                Smitties
              </span>{" "}
              NFT Marketplace
            </h1>
          </Link>

          <button
            className="px-4 py-2 rounded-full bg-rose-400 text-white lg:px-5 lg:py-3 lg:text-base"
            onClick={() => (address ? disconnect() : connectWithMetamask())}
          >
            {address ? <span>Sign Out </span> : <span>Sign In</span>}
          </button>
        </header>
        <hr className="" />
        <div className="text-red-400 text-center py-2">
          {address ? <span>Connected: {address}</span> : ""}
        </div>
        <div className="flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 md:justify-center">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection?.mainImage).url()}
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection?.nftCollectionName}
          </h1>
          {loading ? (
            <p className="pt-2 text-green-500 text-xl animate-pulse">
              Loading supply count ...
            </p>
          ) : (
            <p className="pt-2 text-green-500 text-xl">
              {claimedSupply}/{totalSupply?.toString()} NFTs Claimed
            </p>
          )}

          {loading && (
            <img
              className="w-8- h-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            ></img>
          )}
        </div>
        <div>
          <button
            onClick={mintNFT}
            disabled={
              loading || claimedSupply === totalSupply?.toNumber() || !address
            }
            className="px-4 py-2 rounded-full w-full bg-rose-400 text-white font-bold lg:px-5 lg:py-3 lg:text-base disabled:bg-gray-400"
          >
            {loading ? (
              <>Loading</>
            ) : claimedSupply === totalSupply?.toNumber() ? (
              <>SOLD OUT</>
            ) : !address ? (
              <>Sign in to mint.</>
            ) : (
              <span className="font-bold"> Mint NFT ({price} ETH)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};
