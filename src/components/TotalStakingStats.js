import React from 'react';
import { Text, Box, Grid} from "@chakra-ui/core"
import {removeDecimal} from "../utils"

export default function TotalStakingStats({totalStaked, totalStakers, totalDistributions, totalAsko }) {

  return (
    <Box w="100%" bg="asko.bgMed" p={{base:"20px",sm:"40px"}} borderRadius={{base:"20px",sm:"40px"}} mt="20px" mb={{base:"20px",sm:"50px"}} >
      <Text fontWeight="bold" fontSize={{base:"24px", sm:"36px"}} mb="20px">Total Staking Stats</Text>
      <Grid templateRows="max-content" templateColumns={{base:"auto",sm:"auto auto auto"}} w="100%" gap="20px">
        <Box>
          <Text fontSize={{base:"18px", sm:"21px"}} color="asko.fgMed">Total Staked:</Text>
          <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(totalStaked)}</Text>
          <Text fontSize={{base:"16px", sm:"18px"}} color="asko.fgMed">
            <Text as="span" color="asko.fgAccent" >
              { isNaN(totalStaked) || isNaN(totalAsko) || Number(totalStaked) < 1 || Number(totalAsko) < 1 ?
                "0.00"
                :
                ((Number(totalStaked) / Number(totalAsko)) * 100).toFixed(2)
              }{"% "}
            </Text>
            of Total Supply
          </Text>
        </Box>
        <Box>
          <Text fontSize={{base:"18px", sm:"21px"}} color="asko.fgMed">Total Stakers:</Text>
          <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(totalStakers)}</Text>
        </Box>
        <Box>
          <Text fontSize={{base:"18px", sm:"21px"}} color="asko.fgMed">Total Dividends:</Text>
          <Text fontSize={{base:"24px", sm:"30px"}} fontWeight="bold">{removeDecimal(totalDistributions)}</Text>
        </Box>
      </Grid>
    </Box>
  );
}
