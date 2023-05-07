import React, { useState } from 'react';

import {
  Flex,
  Link,
  Heading,
  Text,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { useOutsideClick } from '@chakra-ui/react'

import Username from './username';
import { updateRecord } from './firebase';


function shortDate(date) {
  return new Date(date).toLocaleString()
}


export default function({id, item}) {
  const {name, createdBy, createdAt} = item;

  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(false);
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
      updateRecord(`lists/${id}`, {deletedAt: new Date().valueOf()});
      setDeleting(false);
    } else {
      setDeleting(true);
    }
  }

  function startEditing() {
    setNewName(name);
    setEditing(true);
  }


  function finishEditing() {
    updateRecord(`lists/${id}`, {name: newName});
    setEditing(false);
  }

  function updateName(event) {
    setNewName(event.target.value);
  }

  return editing ? (
    <Flex
      bgColor="white"
      px={6}
      py={4}
      m={4}
      justify="space-between"
    >
      <Flex>
        <Input value={newName} onChange={updateName}/>
      </Flex>
      <IconButton
        ml={4}
        icon={<CheckIcon/>}
        variant="ghost"
        colorScheme="green"
        onClick={finishEditing}
      />
      <Flex ref={ref}>
        <IconButton
          icon={<DeleteIcon color={deleting ? "red.500" : "gray.300"}/>}
          variant="ghost"
          onClick={handleDeleting}
        />
      </Flex>
    </Flex>
  ) : (
    <Flex
      key={id}
      m={4}
      bgColor="white"
      pl={6}
      pr={2}
      py={4}
      justify="space-between"
    >
      <Flex flexDir="column">
        <Link href={`lists/${id}`}>
          <Heading fontSize="xl">{name}</Heading>
          <Text color="gray.400" fontSize="sm">
            Created by <Username uid={createdBy}/>, at {shortDate(createdAt)}
          </Text>
        </Link>
      </Flex>
      <IconButton
        ml={4}
        icon={<EditIcon/>}
        variant="ghost"
        color="gray.400"
        onClick={startEditing}
      />
    </Flex>
  )

}
