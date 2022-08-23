import React from "react";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useWalletConnect,
} from "@thirdweb-dev/react";

function NFTDropPage() {
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex h-screen flex-col md:grid md:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 md:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-500 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://img.seadn.io/files/32d60c14ee6393483c6cc326c48f6b63.png?fit=max&w=600"
              alt=""
            />
          </div>

          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl text-white font-bold ">The Slime Balls</h1>
            <h2 className="text-xl text-gray-300">
              A collection of useless slime balls
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 md:col-span-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="w-52 cursor-pointer text-xl sm:w-80 flex-grow">
            The{" "}
            <span className="font-extrabold underline decoration-pink-600/50">
              Slime Balls
            </span>{" "}
            Marketplace
          </h1>
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
            src="https://links.papareact.com/bdy"
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The Slime Balls NFT Drop
          </h1>
          <p className="pt-2 text-green-500 text-xl">13/21 NFTs Claimed</p>
        </div>
        <div>
          <button className="px-4 py-2 rounded-full w-full bg-rose-400 text-white font-bold lg:px-5 lg:py-3 lg:text-base">
            Mint NFT (0.01 ETH)
          </button>
        </div>
      </div>
    </div>
  );
}

export default NFTDropPage;
