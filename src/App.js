import React, { useState, useEffect } from "react";
import addresses from "./contracts/addresses";
import abis from "./contracts/abis";
import { ThemeProvider, CSSReset, Box, SimpleGrid, Image, Heading, Flex, Text, Button,Tabs, TabList, Tab, TabPanel, TabPanels} from "@chakra-ui/core"
import theme from "./theme"
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
import StakingButtonGroup from "./components/StakingButtonGroup"
import AccountStakingStats from "./components/AccountStakingStats"
import TotalStakingStats from "./components/TotalStakingStats"
import StakeTab from "./components/StakeTab"
import UnstakeTab from "./components/UnstakeTab"
import DividendsTab from "./components/DividendsTab"
import StakingBonus from "./components/StakingBonus"


const INFURA_ID = "82014a99110c48dabeb8e2d5489599e5"

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

  const toBN = web3.utils.toBN
  const toWei = web3.utils.toWei
  const fromWei = web3.utils.fromWei

  const [connected, setConnected] = useState(false)
  const [chainId, setChainId] = useState(1)
  const [networkId, setNetworkId] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [rewardPoolRegistrationStart, setRewardPoolRegistrationStart] = useState(Date.UTC(2020,6,9,13,30,0,0))
  const [rewardPoolStart, setRewardPoolStart] = useState(Date.UTC(2020,6,10,13,30,0,0))
  const [isRewardPoolRegistrationActive, setIsRewardPoolRegistrationActive] = useState((Date.now() > rewardPoolRegistrationStart))
  const [isRewardPoolActive, setIsRewardPoolActive] = useState((Date.now() > rewardPoolStart))
  const [requestStakeValue, setRequestStakeValue] = useState("")
  const [requestUnstakeValue, setRequestUnstakeValue] = useState("")
  const [requestWithdrawValue, setRequestWithdrawValue] = useState("")
  const [requestReinvestValue, setRequestReinvestValue] = useState("")

  const [totalStaked, setTotalStaked] = useState("")
  const [totalStakers, setTotalStakers] = useState("")
  const [totalDistributions, setTotalDistributions] = useState("")
  const [totalAsko, setTotalAsko] = useState("")


  const [accountAsko, setAccountAsko] = useState("")
  const [accountStake, setAccountStake] = useState("")
  const [accountDivis, setAccountDivis] = useState("")
  const [accountApproved, setAccountApproved] = useState("")
  const [accountIsRegistered, setAccountIsRegistered] = useState(false)



  const [askoStakingSC, setAskoStakingSC] = useState(null)
  const [askoTokenSC, setAskoTokenSC] = useState(null)
  const [askoStakingRewardPoolSC, setAskoStakingRewardPoolSC] = useState(null)

  const [currentCycle, setCurrentCycle] = useState("0")

  const [previousCycleStakerPoolOwnership, setPreviousCycleStakerPoolOwnership] = useState("")
  const [currentCycleStakerPoolOwnership, setCurrentCycleStakerPoolOwnership] = useState("")
  const [nextCycleStakerPoolOwnership, setNextCycleStakerPoolOwnership] = useState("")

  const [previousCyclePoolTotal, setPreviousCyclePoolTotal] = useState("")
  const [currentCyclePoolTotal, setCurrentCyclePoolTotal] = useState("")
  const [nextCyclePoolTotal, setNextCyclePoolTotal] = useState("")

  const [previousCyclePayout, setPreviousCyclePayout] = useState("")
  const [currentCyclePayout, setCurrentCyclePayout] = useState("")
  const [nextCyclePayout, setNextCyclePayout] = useState("")

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
    await askoTokenSC.methods.approve(addresses.askoStaking,web3.utils.toWei("140000000")).send({from:address})
    alert("Approve request sent. Check your wallet to see when it has confirmed.")
  }

  const handleStake = async () => {
    const accountAskoWei = toBN(toWei(accountAsko))
    const requestStakeValueWei = toBN(toWei(requestStakeValue.toString()))
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(accountAskoWei.lt(requestStakeValueWei)) {
      alert("Your account does not have enough ASKO.")
      return
    }
    await askoStakingSC.methods.stake(requestStakeValueWei).send({from:address})
    alert("Stake request sent. stake your wallet to see when it has confirmed.")
  }

  const handleUnstake = async () => {
    const accountStakeWei = toBN(toWei(accountStake))
    const requestUnstakeValueWei = toBN(toWei(requestUnstakeValue.toString()))
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(accountStakeWei.lt(requestUnstakeValueWei)){
      alert("Your stake is not that large.")
      return
    }
    await askoStakingSC.methods.unstake(requestUnstakeValueWei).send({from:address})
    alert("Unstake request sent. Check your wallet to see when it has confirmed.")
  }

  const handleRewardPoolRegistration = async () => {
    await askoStakingRewardPoolSC.methods.register().send({from:address})
  }

  const handleRewardPoolClaim = async () => {
    await askoStakingRewardPoolSC.methods.claim().send(currentCycle,{from:address})
  }

  const handleWithdraw = async () => {
    const accountDivisWei = toBN(toWei(accountDivis))
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    await askoStakingSC.methods.withdraw(accountDivisWei).send({from:address})
    alert("Withdraw request sent. Check your wallet to see when it has confirmed.")
  }

  const handleReinvest = async () => {
    const accountDivisWei = toBN(toWei(accountDivis))
    if(!web3 || !address || !askoStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    await askoStakingSC.methods.reinvest(accountDivisWei).send({from:address})
    alert("Reinvest request sent. Check your wallet to see when it has confirmed.")
  }

  useEffect(()=>{
    if(window.web3) onConnect()
  },[])

  useEffect(()=>{
    if(!web3) return
    if(!address) return

    const askoTokenSC = new web3.eth.Contract(abis.askoToken, addresses.askoToken)
    const askoStakingSC = new web3.eth.Contract(abis.askoStaking, addresses.askoStaking)
    const askoStakingRewardPoolSC = new web3.eth.Contract(abis.askoStakingRewardPool, addresses.askoStakingRewardPool)
    if (!askoTokenSC) return
    if (!askoStakingSC) return
    if (!askoStakingRewardPoolSC) return

    let fetchData = async(web3,address,askoTokenSC,askoStakingSC,askoStakingRewardPoolSC)=>{
      const [
        totalStaked,
        totalStakers,
        totalDistributions,
        accountAsko,
        accountStake,
        accountDivis,
        accountApproved,
        accountIsRegistered,
        currentCycle,
        totalAsko
      ] = await Promise.all([
        askoStakingSC.methods.totalStaked().call(),
        askoStakingSC.methods.totalStakers().call(),
        askoStakingSC.methods.totalDistributions().call(),
        askoTokenSC.methods.balanceOf(address).call(),
        askoStakingSC.methods.stakeValue(address).call(),
        askoStakingSC.methods.dividendsOf(address).call(),
        askoTokenSC.methods.allowance(address,addresses.askoStaking).call(),
        askoStakingRewardPoolSC.methods.isStakerRegistered(address).call(),
        askoStakingRewardPoolSC.methods.getCurrentCycleCount().call(),
        askoTokenSC.methods.totalSupply().call()
      ])
      const nextCycle = (Number(currentCycle)+1).toString()
      const previousCycle = (Number(currentCycle)-1).toString()
      const [
        previousCycleStakerPoolOwnership,
        currentCycleStakerPoolOwnership,
        nextCycleStakerPoolOwnership,
        previousCyclePoolTotal,
        currentCyclePoolTotal,
        nextCyclePoolTotal,
        previousCyclePayout,
        currentCyclePayout,
        nextCyclePayout
      ] = await Promise.all([
        askoStakingRewardPoolSC.methods.cycleStakerPoolOwnership(previousCycle,address).call(),
        askoStakingRewardPoolSC.methods.cycleStakerPoolOwnership(currentCycle,address).call(),
        askoStakingRewardPoolSC.methods.cycleStakerPoolOwnership(nextCycle,address).call(),
        askoStakingRewardPoolSC.methods.cyclePoolTotal(previousCycle).call(),
        askoStakingRewardPoolSC.methods.cyclePoolTotal(currentCycle).call(),
        askoStakingRewardPoolSC.methods.cyclePoolTotal(nextCycle).call(),
        askoStakingRewardPoolSC.methods.calculatePayout(address,previousCycle).call(),
        askoStakingRewardPoolSC.methods.calculatePayout(address,currentCycle).call(),
        askoStakingRewardPoolSC.methods.calculatePayout(address,nextCycle).call()
      ])
      setTotalStaked(web3.utils.fromWei(totalStaked))
      setTotalStakers(totalStakers)
      setTotalDistributions(web3.utils.fromWei(totalDistributions))
      setAccountAsko(web3.utils.fromWei(accountAsko))
      setAccountStake(web3.utils.fromWei(accountStake))
      setAccountDivis(web3.utils.fromWei(accountDivis))
      setAccountApproved(web3.utils.fromWei(accountApproved))
      setAccountIsRegistered(accountIsRegistered)
      setCurrentCycle(currentCycle)
      setTotalAsko(totalAsko)

      setRequestWithdrawValue(accountDivis)
      setRequestReinvestValue(accountDivis)

      setPreviousCycleStakerPoolOwnership(web3.utils.fromWei(previousCycleStakerPoolOwnership))
      setCurrentCycleStakerPoolOwnership(web3.utils.fromWei(currentCycleStakerPoolOwnership))
      setNextCycleStakerPoolOwnership(web3.utils.fromWei(nextCycleStakerPoolOwnership))

      setPreviousCyclePoolTotal(web3.utils.fromWei(previousCyclePoolTotal))
      setCurrentCyclePoolTotal(web3.utils.fromWei(currentCyclePoolTotal))
      setNextCyclePoolTotal(web3.utils.fromWei(nextCyclePoolTotal))

      setPreviousCyclePayout(web3.utils.fromWei(previousCyclePayout))
      setCurrentCyclePayout(web3.utils.fromWei(currentCyclePayout))
      setNextCyclePayout(web3.utils.fromWei(nextCyclePayout))
    }

    fetchData(web3,address,askoTokenSC,askoStakingSC,askoStakingRewardPoolSC)

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
    setAskoStakingRewardPoolSC(askoStakingRewardPoolSC)

    return ()=>clearInterval(interval)

  },[web3,address])

  return (
    <ThemeProvider theme={theme} >
      <CSSReset />
      <Box w="100%" bg="asko.bg" color="asko.fg" p="20px" pb="160px" >
        <Box w="100%" maxW="1240px" pl={{base:"5px", sm:"20px"}} pr="20px" ml="auto" mr="auto" position="relative">

          <Header web3={web3} address={address} onConnect={onConnect} />

          <AccountStakingStats accountAsko={accountAsko} accountStake={accountStake} accountDivis={accountDivis} totalStaked={totalStaked} />

          <TotalStakingStats totalStaked={totalStaked} totalStakers={totalStakers} totalDistributions={totalDistributions} totalAsko={totalAsko} />

          <Tabs isFitted w="100%" bg="asko.bgMed2" p={{base:"10px",sm:"40px"}}  borderRadius={{base:"20px",sm:"40px"}}  mt={{base:"20px",sm:"50px"}}  mb={{base:"20px",sm:"50px"}} variant="unstyled">
            <TabList borderBottom="solid 1px" borderColor="asko.fgMed2">
              <Tab color="asko.fgMed2" fontSize={{base:"18px",sm:"32px"}} _selected={{color:"asko.fg", border:"none"}} _hover={{color:"asko.fg"}} >
                Stake
              </Tab>
              <Tab color="asko.fgMed2" fontSize={{base:"18px",sm:"32px"}} _selected={{color:"asko.fg", border:"none"}} _hover={{color:"asko.fg"}} >
                Unstake
              </Tab>
              <Tab color="asko.fgMed2" fontSize={{base:"18px",sm:"32px"}} _selected={{color:"asko.fg", border:"none"}} _hover={{color:"asko.fg"}} >
                Dividends
              </Tab>
            </TabList>
            <TabPanels >
              <TabPanel h="480px">
                <StakeTab accountAsko={accountAsko} setRequestStakeValue={setRequestStakeValue} requestStakeValue={requestStakeValue} handleStake={handleStake} />
              </TabPanel>
              <TabPanel h="480px">
                <UnstakeTab accountStake={accountStake} setRequestUnstakeValue={setRequestUnstakeValue} requestUnstakeValue={requestUnstakeValue} handleStake={handleUnstake} />
              </TabPanel>
              <TabPanel h="480px">
                <DividendsTab accountDividends={accountDivis} handleWithdraw={handleWithdraw} handleReinvest={handleReinvest} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <StakingBonus
            previousCycle={Number(currentCycle)-1}  previousCycleOwnership={previousCycleStakerPoolOwnership} previousCycleTotal={previousCyclePoolTotal} previousCyclePayout={previousCyclePayout}
            currentCycle={Number(currentCycle)} currentCycleOwnership={currentCycleStakerPoolOwnership} currentCycleTotal={currentCyclePoolTotal} currentCyclePayout={currentCyclePayout}
            nextCycle={Number(currentCycle)+1}  nextCycleOwnership={nextCycleStakerPoolOwnership} nextCycleTotal={nextCyclePoolTotal} nextCyclePayout={nextCyclePayout}
            handleRewardPoolClaim={handleRewardPoolClaim} handleRewardPoolRegistration={handleRewardPoolRegistration}
          />

        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
