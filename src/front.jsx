import React from 'react';

import { Flex, Heading } from '@chakra-ui/react';
import Login from './login';


const appName = "runtoStore";


export default function (){
  return <Flex direction="column" align="stretch">
    <Flex direction="column" align="center" mx={6}>
      <Heading my={6}>Welcome to {appName}.</Heading>
      <Flex mb={6}>...the best shopping list app.</Flex>
    </Flex>
    <Login/>
  </Flex>
};
