import React from 'react';
import { ThemeProvider, CSSReset, Box, SimpleGrid, Image, Heading, Flex, Text, Link, Button, Tabs, Tab, TabList, TabPanels, TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,  } from "@chakra-ui/core"

  function shortenDecimal(decimalString) {
    decimalString = decimalString.toString()
    if(!decimalString.includes('.')) return decimalString
    return decimalString.substring(0,decimalString.indexOf('.'))
  }

export default function StakingButtonGroup({web3,cap,setVal,val,handleClick,name}) {
  return(
    <Box m="60px" ml="auto" mr="auto" textAlign="center">
      <NumberInput clampValueOnBlur={true} display="inline-block" value={val} min={0} max={5} precision={2} w="100px" m="20px" ml="auto" mr="auto" color="gray.700" >
        <NumberInputField type="number" bg="gray.200" onChange={e => {setVal(web3.utils.toWei(e.target.value.toString()))}} />
        <NumberInputStepper>
        <NumberIncrementStepper onClick={()=>{(val<cap) ? setVal(web3.utils.toWei(val+1)) : web3.utils.toWei(cap)}} />
        <NumberDecrementStepper onClick={()=>{(val>=1) ? setVal(web3.utils.toWei(val-1)) : web3.utils.toWei("0")}} />
      </NumberInputStepper>
      </NumberInput>
      <Button fontSize="xs" color="gray.300" display="inline-block"  bg="gray.700" fg="gray.300" p="0px" h="25px" w="25px" m="10px" minWidth="0px" mb="12px" onClick={()=>setVal(web3.utils.toWei(cap))}>ᐱ</Button>
      <Button color="gray.300" display="block" ml="auto" mr="auto" onClick={handleClick} bg="blue.700" fg="gray.200">{name}</Button>
      <Text m="10px" color="gray.600"  ml="auto" mr="auto" textAlign="center" fontSize="sm">
        MAX: <Text fontSize="md" color="gray.500" display="inline">{shortenDecimal(cap)}</Text>
      </Text>
    </Box>
  )
}
