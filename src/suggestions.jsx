import React from 'react';
import { Flex, Box, HStack, Button, Collapse } from '@chakra-ui/react';


export default function({show, suggestions, onSuggestionClick}) {
  return <Collapse in={show} animateOpacity>
    <Box
      bgColor="blue.300"
      width="100%"
      p={2}
      position="relative"
    >
      <Box
        width="100%"
        overflowX="auto"
        css={{"&::-webkit-scrollbar": {display: "none"}}}
        >
        <HStack gap={1}>
          { suggestions.map(({name, id, completed}) => (
            <Button
              key={id}
              minWidth="initial"
              onClick={_ => onSuggestionClick({id, completed})}
            >
              {name}
            </Button>
          )) }
        </HStack>
      </Box>
      <Box
        position="absolute"
        width="70px"
        height="100%"
        top="0"
        right="0"
        bgGradient="linear(to-r, transparent, blue.300)"
      />
    </Box>
  </Collapse>
}
