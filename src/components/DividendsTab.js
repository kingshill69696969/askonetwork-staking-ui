import React from 'react';
import { Box, Text, Button,
  NumberInput,
  NumberInputField } from "@chakra-ui/core"
  import {removeDecimal} from "../utils"


export default function DividendsTab({accountDividends,handleWithdraw,handleReinvest}) {
  return(
    <Box w="100%" pt="50px" pb="50px" textAlign="center" color="asko.fg" position="relative">
      <Text w="100%" fontSize={{base:"36px",sm:"48px"}} fontWeight="bold" mb={{base:"20px",sm:"40px"}}>
        ASKO Dividends
      </Text>
      <Text w="100%" fontSize={{base:"36px",sm:"48px"}} fontWeight="bold" mb={{base:"20px",sm:"40px"}}>
        {removeDecimal(accountDividends)}
      </Text>
      <Button display="block" bg="asko.accentButton" color="white" ml="auto" mr="auto"
        border="none" borderRadius="32px" w={{base:"200px",sm:"430px"}} h="65px"
        mt={{base:"20px",sm:"45px"}} mb={{base:"10px",sm:"20px"}}
        fontWeight="regular" fontSize={{base:"18px",sm:"24px"}}
        onClick={handleReinvest} >
        Reinvest
      </Button>
      <Button display="block" bg="asko.accentButton" color="white" ml="auto" mr="auto" border="none"
        borderRadius="32px"
        w={{base:"200px",sm:"430px"}} h="65px" mt={{base:"20px",sm:"20px"}} mb="20px"
        fontWeight="regular" fontSize={{base:"18px",sm:"24px"}}
        onClick={handleWithdraw} >
        Withdraw
      </Button>
    </Box>
  )
}
