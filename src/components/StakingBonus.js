import React, { useState, useEffect }  from 'react';
import { Text, Box, Grid, Button} from "@chakra-ui/core"
import {removeDecimal} from "../utils"

function CycleSection({cycle,cycleOwnership,cycleTotal,cyclePayout, cycleName, accent}) {
  return (
    <Grid templateRows="max-content" templateColumns={{base:"auto",md:"auto auto",lg:"auto auto auto auto"}} w="100%" gap="0px" border="solid 1px" mt="20px" mb="20px" borderColor={accent}>
      <Box w="260px" h={{base:"initial",sm:"120px"}} m="10px" p="0px">
        <Text fontSize={{base:"18px", sm:"21px"}} color={accent}>{cycleName} Cycle:</Text>
        <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(cycle)}</Text>
      </Box>
      <Box w="260px" h="120px" m="10px" p="0px">
        <Text fontSize={{base:"18px", sm:"21px"}} color={accent}>Your Ownership ({cycleName.toLowerCase()}):</Text>
        <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(cycleOwnership)}</Text>
        <Text fontSize={{base:"16px", sm:"18px"}} color="asko.fgMed2">
          <Text as="span" color="asko.fgAccent" >
            { isNaN(cycleTotal) || isNaN(cycleOwnership) || Number(cycleTotal) < 1 || Number(cycleOwnership) < 1 ?
              "0.00"
              :
              ((Number(cycleOwnership) / Number(cycleTotal)) * 100).toFixed(2)
            }{"% "}
          </Text>
          of Total Registered
        </Text>
      </Box>
      <Box w="260px" h={{base:"initial",sm:"120px"}} m="10px" p="0px">
        <Text fontSize={{base:"18px", sm:"21px"}} color={accent}>Total Registered ({cycleName.toLowerCase()}):</Text>
        <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(cycleTotal)}</Text>
      </Box>
      <Box w="260px" h={{base:"initial",sm:"120px"}} m="10px" p="0px">
        <Text fontSize={{base:"18px", sm:"21px"}} color={accent}>Your Payout ({cycleName.toLowerCase()}):</Text>
        <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(cyclePayout)}</Text>
      </Box>
    </Grid>
  )
}

export default function StakingBonus({
  previousCycle, previousCycleOwnership, previousCycleTotal, previousCyclePayout,
  nextCycle, nextCycleOwnership, nextCycleTotal, nextCyclePayout,
  currentCycle, currentCycleOwnership, currentCycleTotal, currentCyclePayout,
  handleRewardPoolClaim, handleRewardPoolRegistration
}) {

  const [dy, setDy] = useState(0)
  const [hr, setHr] = useState(0)
  const [mn, setMn] = useState(0)
  const [sc, setSc] = useState(0)


  useEffect(()=>{
    const cycleStart = 1594387800
    const cycleLength = 86400*30
    const updateTimes = ()=>{
      const epoch = Math.floor((new Date()).getTime() / 1000)
      const timeLeft = cycleLength - ((epoch-cycleStart)%cycleLength)
      const dy = Math.floor(timeLeft / 86400)
      const hr = Math.floor((timeLeft-dy*86400) / 3600)
      const mn = Math.floor((timeLeft-dy*86400-hr*3600) / 60)
      const sc = Math.floor(timeLeft-dy*86400-hr*3600-mn*60)
      setDy(dy)
      setHr(hr)
      setMn(mn)
      setSc(sc)
    }
    updateTimes()
    let interval = setInterval(updateTimes,1000)

    return ()=>clearInterval(interval)
  },[])


  return (
    <Box w="100%" bg="asko.bgMed" p={{base:"20px",sm:"40px"}} borderRadius={{base:"20px",sm:"40px"}} mt="20px" mb={{base:"20px",sm:"50px"}} pb="80px">
      <Text fontWeight="bold" fontSize={{base:"24px", sm:"36px"}} mb="20px">30 Days Staking Bonus Rewards</Text>
      <CycleSection cycle={previousCycle} cycleOwnership={previousCycleOwnership} cycleTotal={previousCycleTotal} cyclePayout={previousCyclePayout} cycleName="Previous" accent="asko.fgMed2" />
      <CycleSection cycle={currentCycle} cycleOwnership={currentCycleOwnership} cycleTotal={currentCycleTotal} cyclePayout={currentCyclePayout} cycleName="Current" accent="asko.strokeAccent" />
      <CycleSection cycle={nextCycle} cycleOwnership={nextCycleOwnership} cycleTotal={nextCycleTotal} cyclePayout={nextCyclePayout} cycleName="Next" accent="asko.fgMed2" />

      <Text fontSize={{base:"16px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center">
        Next cycle begins in:
      </Text>
      <Box w="100%" textAlign="center" mb="40px">
        <Box display="inline-block" w={{base:"40px",sm:"90px"}} m="10px">
          <Text fontWeight="bold" fontSize={{base:"24px",sm:"42px"}}>{dy}</Text>
          <Text fontSize={{base:"12px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center" fontWeight="light">
            DAYS
          </Text>
        </Box>
        <Box display="inline-block" w={{base:"40px",sm:"90px"}} m="10px">
          <Text fontWeight="bold" fontSize={{base:"24px",sm:"42px"}}>{hr}</Text>
          <Text fontSize={{base:"12px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center" fontWeight="light">
            HOURS
          </Text>
        </Box>
        <Box display="inline-block" w={{base:"40px",sm:"90px"}} m="10px">
          <Text fontWeight="bold" fontSize={{base:"24px",sm:"42px"}}>{mn}</Text>
          <Text fontSize={{base:"12px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center" fontWeight="light">
            MINUTES
          </Text>
        </Box>
        <Box display="inline-block" w={{base:"40px",sm:"90px"}} m="10px">
          <Text fontWeight="bold" fontSize={{base:"24px",sm:"42px"}}>{sc}</Text>
          <Text fontSize={{base:"12px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center" fontWeight="light">
            SECONDS
          </Text>
        </Box>
      </Box>


      { (isNaN(nextCycleOwnership) || (Number(nextCycleOwnership)) < 1) &&
        <Button bg="asko.accentButton" color="white" ml="auto" mr="auto" border="none" borderRadius="32px"
          w={{base:"200px",sm:"430px"}} h="65px" mt="20px" mb="10px"
          fontWeight="regular" fontSize="24px" display="block"
          onClick={handleRewardPoolRegistration}>
            Register
        </Button>
      }

      <Button bg="asko.accentButton" color="white" ml="auto" mr="auto" border="none" borderRadius="32px"
        w={{base:"200px",sm:"430px"}} h="65px" mt="20px" mb="10px"
        fontWeight="regular" fontSize="24px" display="block" isDisabled={(isNaN(previousCyclePayout) || (Number(previousCyclePayout)) < 1)}
        onClick={handleRewardPoolClaim}>
          Claim
      </Button>

      <Text fontSize={{base:"16px", sm:"18px"}} color="asko.fgMed" w="100%" textAlign="center">
        Claim <Text as="span" color="asko.fgAccent" >{previousCyclePayout}</Text> from previous cycle
      </Text>

    </Box>
  );
}
