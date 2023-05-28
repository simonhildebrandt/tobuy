import React from 'react';
import { Flex, Box } from '@chakra-ui/react';


export default function({suggestions, onSuggestionClick}) {
  return suggestions.length > 0 && (
    <Box
      bgColor="blue.300"
      width="100%"
      height="110px"
      p={2}
      position="relative"
    >
      <Box
        position="absolute"
        width="70px"
        height="100%"
        top="0"
        right="0"
        bgGradient="linear(to-r, transparent, blue.300)"
      />
      <Box
        width="100%"
        overflowX="auto"
        css={{"&::-webkit-scrollbar": {display: "none"}}}
        >
        <Flex gap={2}>
          { suggestions.map(({name, id, completed}) => (
            <Flex
              key={id}
              cursor="pointer"
              bgColor="gray.100"
              px={3}
              py={2}
              borderRadius={8}
              whiteSpace="nowrap"
              onClick={_ => onSuggestionClick({id, completed})}
            >
              {name}
            </Flex>
          )) }
        </Flex>
      </Box>
    </Box>
  );
}
