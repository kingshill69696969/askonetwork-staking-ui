import React from 'react';
import { Box, Text, Button,
  NumberInput,
  NumberInputField } from "@chakra-ui/core"
  import {removeDecimal} from "../utils"


export default function UnstakeTab({accountStake,setRequestUnstakeValue,requestUnstakeValue,handleUnstake}) {
  return(
    <Box w="100%" pt="50px" pb="50px" textAlign="center" color="asko.fg" position="relative">
      <Text w="100%" fontSize={{base:"36px",sm:"48px"}} fontWeight="bold" mb={{base:"20px",sm:"40px"}}>
        Unstake ASKO
      </Text>
      <Text w="100%" fontSize={{base:"18px",sm:"21px"}} color="asko.fgMed2"
        mt={{base:"20px",sm:"40px"}} mb={{base:"20px",sm:"40px"}}>
        MAX: {removeDecimal(accountStake)}
      </Text>
      <NumberInput fontSize={{base:"18px",sm:"21px"}}  w={{base:"100%",md:"700px"}}
        display="inline-block" value={removeDecimal(requestUnstakeValue)} min={0}
        max={removeDecimal(accountStake)} step={1}
        >
        <NumberInputField w="100%" h="60px" border="none" borderRadius="30px" pl="20px"
        fontSize={{base:"18px",sm:"21px"}} position="relative" zIndex="1"
          type="number" bg="asko.fg" color="asko.bg" placeholder="Amount of ASKO to Stake"
          whilePlaceholder={{color:"asko.fgMed" }}
          onChange={e => {
            if(isNaN(e.target.value)) return
            if(e.target.value === "") {
              setRequestUnstakeValue("")
            } else if(Number(e.target.value) > 140000000) {
              setRequestUnstakeValue("140000000")
            } else if(Number(e.target.value) < 1) {
              setRequestUnstakeValue("1")
            } else{
              setRequestUnstakeValue(removeDecimal(Number(e.target.value)))
            }
          }} />
          <Button fontSize={{base:"18px",sm:"21px"}} display={{base:"block",sm:"inline-block"}}
            border="none" borderRadius="30px" bg="#C7d6E4" color="#7b7b7b" w="120px" h="60px"
            position={{base:"inherit",sm:"absolute"}} right="0px" zIndex="2"
            m={{base:"20px",sm:"0px"}} ml={{base:"auto",sm:"0px"}} mr={{base:"auto",sm:"0px"}}
          onClick={()=>setRequestUnstakeValue(removeDecimal(accountStake))}>
          Max
        </Button>
      </NumberInput>
      <Button bg="asko.accentButton" color="white" ml="auto" mr="auto" border="none"
        borderRadius="32px" w={{base:"200px",sm:"430px"}} h="65px" mt={{base:"0px",sm:"70px"}}
        mb="0px"
        fontWeight="regular" fontSize={{base:"18px",sm:"24px"}}
        onClick={handleUnstake} >
        Unstake
      </Button>

    </Box>
  )
}
