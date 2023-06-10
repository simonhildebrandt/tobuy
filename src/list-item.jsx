import React, { useState, useEffect } from 'react';
import { Flex, Text, Checkbox, IconButton, Input } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useOutsideClick } from '@chakra-ui/react'


export default function({item, onComplete, onDelete, onUpdate}) {
  const { id, name, completed, detail } = item;

  const [deleting, setDeleting] = useState(false);
  const [newDetail, setNewDetail] = useState("");

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

  useEffect(() => {
    setNewDetail(detail || "");
  }, [detail]);

  function updateDetail(event) {
    setNewDetail(event.target.value);
  }

  function saveDetail() {
    onUpdate(id, {detail: newDetail});
  }

  return <Flex
    pl={[4]}
    pr={2}
    py={[2]}
    bgColor="white"
    align="center"
    justify="space-between"
  >
    <Flex
      as="form"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      gap={4}
      flexGrow={1}
      alignItems="center"
      pr={1}
      py="2px"
      autoComplete="off"
    >
      <Checkbox
        isChecked={completed}
        onChange={_ => onComplete(id, !completed)}
        size="lg"
      />
      <Flex flexGrow={1}>
        <Text
          textDecoration={completed ? 'line-through' : ''}
          color={completed ? 'gray.400' : 'black'}
        >
          {name}
        </Text>
      </Flex>
      <Input
        size="sm"
        border={0}
        textAlign="right"
        value={newDetail}
        onChange={updateDetail}
        onBlur={saveDetail}
      />
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
