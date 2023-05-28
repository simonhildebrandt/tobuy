import React, { useState } from 'react';
import { Flex, Text, Checkbox, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useOutsideClick } from '@chakra-ui/react'


export default function({item, onComplete, onDelete}) {
  const { id, name, completed} = item;

  const [deleting, setDeleting] = useState(false);

  const ref = React.useRef();
  useOutsideClick({
    ref: ref,
    handler: () => {
      setDeleting(false);
    },
  });

  function handleDeleting() {
    if (deleting) {
      onDelete(id);
      setDeleting(false);
    } else {
      setDeleting(true);
    }
  }

  return <Flex
    pl={[4]}
    pr={2}
    py={[2]}
    bgColor="white"
    align="center"
    justify="space-between"
  >
    <Flex>
      <Checkbox
        isChecked={completed}
        onChange={_ => onComplete(id, !completed)}
        size="lg"
        mr={4}
      />
      <Text
        textDecoration={completed ? 'line-through' : ''}
        color={completed ? 'gray.400' : 'black'}
      >
        {name}
      </Text>
    </Flex>

    <Flex ref={ref}>
      <IconButton
        icon={<DeleteIcon color={deleting ? "red.500" : "gray.300"}/>}
        variant="ghost"
        onClick={handleDeleting}
      />
    </Flex>
  </Flex>
}
