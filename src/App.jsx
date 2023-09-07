import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Game from './pages/Game';
import { configureChains, WagmiConfig, createConfig } from "wagmi";
import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { ToastContainer } from 'react-toastify';
import NewGame from './pages/NewGame';
import Claim from './pages/Claim';
import "react-toastify/dist/ReactToastify.css";
import { DEFAULT_PROJECT_ID } from './constants';
import { CustomW3mConnector } from './helpers/CustomW3mConnector';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/new',
      element: <NewGame />
    },
    {
      path: '/claim',
      element: <Claim />
    },
    {
      path: '/game/:id',
      element: <Game />
    }
  ])

  const baobab = {
    id: 1001,
    name: "Baobab",
    network: "baobab",
    nativeCurrency: {
      name: "KLAY",
      symbol: "KLAY",
      decimals: 18,
    },
    rpcUrls: {
      default:
      {
        http: ["https://public-en-baobab.klaytn.net"],
        webSocket: ['wss://public-en-baobab.klaytn.net/ws'],
      },
      public:
      {
        http: ["https://public-en-baobab.klaytn.net"],
        webSocket: ['wss://public-en-baobab.klaytn.net/ws'],
      },
    },
    blockExplorers: {
      default: {
        name: "BaobabScope",
        url: "https://baobab.scope.klaytn.com",
      },
    },
    testnet: true,
  };

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [baobab],
    [w3mProvider({ projectId: '779782067b414023d7730e8e9173093d' })]
  );

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [new CustomW3mConnector({
      chains: [baobab], options: {
      projectId: '779782067b414023d7730e8e9173093d', showQrModal: false, methods: ["debug_traceCall", "eth_requestSessionKey"], optionalMethods: ["debug_traceCallx"]
    }})],
    webSocketPublicClient,
    publicClient,
  });
  
  const ethereumClient = new EthereumClient(wagmiConfig, chains)

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RouterProvider router={router} />
      </WagmiConfig>
      <ToastContainer />
      <Web3Modal projectId={'779782067b414023d7730e8e9173093d'} ethereumClient={ethereumClient}/>
    </>
  )
}

export default App
