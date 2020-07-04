import React, { useState, useEffect } from "react";
import addresses from "./contracts/addresses";
import abis from "./contracts/abis";
import { ThemeProvider, CSSReset, Box, SimpleGrid, Image, Heading, Flex, Text, Link, Button, Tabs, Tab, TabList, TabPanels, TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,  } from "@chakra-ui/core"
import theme from "@chakra-ui/theme"
import "./App.css";

import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";
import Portis from "@portis/web3";
import Squarelink from "squarelink";
import Arkane from "@arkane-network/web3-arkane-provider";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import DcentProvider from "dcent-provider";

import CountDown from "./components/CountDown"
import Footer from "./components/Footer"
import Header from "./components/Header"


const INFURA_ID = "f7400d35bb95446ebe055f70cde7ab19"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID // required
    }
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: "pk_live_522E2B32F46FB16A" // required
    }
  },
  torus: {
    package: Torus, // required
  },
  authereum: {
    package: Authereum // required
  },
  unilogin: {
    package: UniLogin // required
  },
  portis: {
    package: Portis, // required
    options: {
      id: "12f64063-f3e7-4bed-bb31-8c6dd697867b" // required
    }
  },
  squarelink: {
    package: Squarelink, // required
    options: {
      id: "88f1885b8489c400f03b" // required
    }
  },
  mewconnect: {
    package: MewConnect, // required
    options: {
      infuraId: INFURA_ID // required
    }
  }
};

function shortenDecimal(decimalString) {
  decimalString = decimalString.toString()
  if(!decimalString.includes('.')) return decimalString
  return decimalString.substring(0,decimalString.indexOf('.'))
}

console.log(Web3Modal)

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});



function App() {

  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'+INFURA_ID))
  const [web3, setWeb3] = useState(new Web3(provider))
  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(1)
  const [networkId, setNetworkId] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [time, setTime] = useState(Date.UTC(2020,6,4,13,30,0,0))
  const [isActive, setIsActive] = useState((Date.now() > time))
  const [requestStakeValue, setRequestStakeValue] = useState(0)
  const [requestUnstakeValue, setRequestUnstakeValue] = useState(0)
  const [requestWithdrawValue, setRequestWithdrawValue] = useState(0)
  const [requestReinvestValue, setRequestReinvestValue] = useState(0)

  const [totalStaked, setTotalStaked] = useState("0")
  const [totalStakers, setTotalStakers] = useState("0")
  const [totalDistributions, setTotalDistributions] = useState("0")

  const [accountAsko, setAccountAsko] = useState("0")
  const [accountStake, setAccountStake] = useState("0")
  const [accountDivis, setAccountDivis] = useState("0")

  const [askoStakingSC, setAskoStakingSC] = useState(null)
  const [askoTokenSC, setAskoTokenSC] = useState(null)

  const initWeb3 = async (provider) => {
    const web3 = new Web3(provider);

    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber
        }
      ]
    });

    return web3;
  }


  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAddress("")
    setWeb3(null)
    setProvider(null)
    setConnected(false)
    setChainId(1)
    setNetworkId(1)
    setShowModal(false)
  };

  const subscribeProvider = async (provider,web3) => {
      if (!provider.on) {
        return
      }
      provider.on("close", () => resetApp(web3));
      provider.on("accountsChanged", async (accounts) => {
        setAddress(accounts[0])
      });
      provider.on("chainChanged", async (chainId) => {
        const networkId = await web3.eth.net.getId()
        setChainId(chainId)
        setNetworkId(networkId)
      });
      provider.on("networkChanged", async (networkId) => {
        const chainId = await web3.eth.chainId();
        setChainId(chainId)
        setNetworkId(networkId)
      });
    };

  const onConnect = async () => {
    const provider = await web3Modal.connect()
    const web3 = await initWeb3(provider)
    await subscribeProvider(provider,web3)
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]
    const networkId = await web3.eth.net.getId()
    const chainId = await web3.eth.chainId()

    setConnected(true)
    setAddress(address)
    setChainId(chainId)
    setNetworkId(networkId)
    setProvider(provider)
    setWeb3(web3)
  }

  const handleApprove = async () =>{
    if(!web3 || !address || !askoStakingSC || !askoTokenSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    askoTokenSC.approve(addresses.askoStaking,"140000000")
    alert("Approve request sent. Check your wallet to see when it has confirmed.")
  }

  const handleStake = async () => {
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(web3.utils.toBN(accountAsko).lt(web3.utils.toBN(requestStakeValue))){
      alert("Your account does not have enough ASKO.")
    }
    await askoStakingSC.methods.deposit(web3.utils.toWei(requestStakeValue.toString())).send({from:address})
    alert("Stake request sent. stake your wallet to see when it has confirmed.")
  }

  const handleUnstake = async () => {
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(web3.utils.toBN(accountStake).lt(web3.utils.toBN(requestUnstakeValue))){
      alert("Your stake is not that large.")
    }
    await askoStakingSC.methods.unstake(web3.utils.toWei(requestUnstakeValue.toString())).send({from:address})
    alert("Stake request sent. Check your wallet to see when it has confirmed.")
  }

  const handleWithdraw = async () => {
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(web3.utils.toBN(accountDivis).lt(web3.utils.toBN(requestUnstakeValue))){
      alert("Your have not earned enough dividends.")
    }
    await askoStakingSC.methods.withdraw(web3.utils.toWei(requestUnstakeValue.toString())).send({from:address})
    alert("Stake request sent. Check your wallet to see when it has confirmed.")
  }

  const handleReinvest = async () => {
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(web3.utils.toBN(accountDivis).lt(web3.utils.toBN(requestReinvestValue))){
      alert("Your have not earned enough dividends.")
    }
    await askoStakingSC.methods.reinvest(web3.utils.toWei(requestReinvestValue.toString())).send({from:address})
    alert("Stake request sent. Check your wallet to see when it has confirmed.")
  }

  useEffect(()=>{
    if(window.web3) onConnect()
  },[])

  useEffect(()=>{
    if(!web3) return
    if(!address) return

    const askoTokenSC = new web3.eth.Contract(abis.askoToken, addresses.askoToken)
    const askoStakingSC = new web3.eth.Contract(abis.askoStaking, addresses.askoStaking)
    if (!askoTokenSC) return
    if (!askoStakingSC) return

    let fetchData = async(web3,address,askoTokenSC,askoStakingSC)=>{
      const [
        totalStaked,
        totalStakers,
        totalDistributions,
        accountAsko,
        accountStake,
        accountDivis
      ] = await Promise.all([
        askoStakingSC.methods.totalStaked().call(),
        askoStakingSC.methods.totalStakers().call(),
        askoStakingSC.methods.totalDistributions().call(),
        askoTokenSC.methods.balanceOf(address).call(),
        askoStakingSC.methods.stakeValue(address).call(),
        askoStakingSC.methods.dividendsOf(address).call()
      ])
      setTotalStaked(web3.utils.fromWei(totalStaked))
      setTotalStakers(web3.utils.fromWei(totalStakers))
      setTotalDistributions(web3.utils.fromWei(totalDistributions))
      setAccountAsko(web3.utils.fromWei(accountAsko))
      setAccountStake(web3.utils.fromWei(accountStake))
      setAccountDivis(accountDivis)
    }

    fetchData(web3,address,askoTokenSC,askoStakingSC)

    let interval;
    if(window.web3){
      interval = setInterval((web3,address,askoTokenSC,askoStakingSC)=>{
        if(!web3 || !address || !askoTokenSC || !askoStakingSC) return
        fetchData(web3,address,askoTokenSC,askoStakingSC)
      },3000)
    }else{
      interval = setInterval((web3,address,askoTokenSC,askoStakingSC)=>{
        if(!web3 || !address || !askoTokenSC || !askoStakingSC) return
        fetchData(web3,address,askoTokenSC,askoStakingSC)
      },7000)
    }

    setAskoTokenSC(askoTokenSC)
    setAskoStakingSC(askoStakingSC)

    return (interval)=>clearInterval(interval)

  },[web3,address])

  useEffect(()=>{
    if(Date.now() < time){
      let interval = setInterval(()=>{
        setIsActive(Date.now() > time)
      },500)
      return (interval)=>clearInterval(interval)
    }
  },[time])


  return (
    <ThemeProvider theme={theme} >
      <CSSReset />
      <Box w="100%" minH="100vh" bg="gray.800" color="gray.100" position="relative"  p="20px" pb="160px" >
        <Header web3={web3} address={address} onConnect={onConnect} />
        { address ? (
          <Text mb="40px" mt="40px" color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
            Account connected.
          </Text>
        ) : (
          <Text mb="40px" mt="40px" color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
            No Ethereum wallet connected.
          </Text>
        )}
        <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>

        { isActive ?
          (<>
            <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
            <Box m='60px' ml="auto" mr="auto" textAlign="center">
              <Text color="gray.500" display="block" fontSize="2xl" p="10px" pb="0px" textAlign="center">
                Your Staking Stats
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
                Your ASKO: {accountAsko}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
                Your ASKO staked: {accountStake}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Your dividends: {totalDistributions}
              </Text>
            </Box>
            <Box width="250px" height="1px" bg="gray.700" ml="auto" mr="auto" mt="10px" mb="10px"></Box>
            <Box m='60px' ml="auto" mr="auto" textAlign="center">
              <Text color="gray.500" display="block" fontSize="2xl" p="10px" pb="0px" textAlign="center">
                Total Staking Stats
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px" textAlign="center">
                Total ASKO staked: {totalStaked}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Total ASKO stakers: {totalStakers}
              </Text>
              <Text color="gray.300" display="block" fontSize="sm" p="10px" pb="0px"  textAlign="center">
                Total dividends: {totalDistributions}
              </Text>
            </Box>
          </>) :
          (<Box mt="30vh">
            <Text ml="auto" mr="auto" textAlign="center" fontSize="sm">staking opens in</Text>
            <CountDown expiryTimestamp={time}  />
          </Box>)
        }
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
