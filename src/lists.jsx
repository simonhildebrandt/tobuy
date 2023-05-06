import React, { useState } from 'react';

import {
  Flex,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Heading,
  Text
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useFirestoreCollection, addRecord } from './firebase';
import Username from './username';

function shortDate(date) {
  return new Date(date).toLocaleString()
}

export default function({user}) {
  const { data, loaded } = useFirestoreCollection(`lists`, ['owners', 'array-contains', user.uid]);
  const [newItem, setNewItem] = useState('');
  function updateNewItem(e) {
    setNewItem(e.target.value);
  }
  function addNewItem() {
    addRecord('lists', {
      name: newItem,
      createdAt: new Date().valueOf(),
      createdBy: user.uid,
      owners: [user.uid],
      items: [],
      deletedAt: null,
    });
    setNewItem('');
  }

  if (!loaded) return <Spinner/>;

  const items = Object.entries(data);

  return <Flex flexDir="column" flexGrow={1} overflowY="auto">
    { items.length == 0 && 'No lists found - click to create one!' }

    <Flex flexDir="column" flexGrow={1}>
      { items.map(([id, {name, createdAt, createdBy}]) => (
        <Flex
          key={id}
          m={4}
          bgColor="white"
          px={8}
          py={4}
          flexDir="column"
        >
          <Heading fontSize="xl"><Link href={`lists/${id}`}>{name}</Link></Heading>
          <Text color="gray.400" fontSize="sm">
            Created by <Username uid={createdBy}/>, at {shortDate(createdAt)}
          </Text>
        </Flex>
      )) }
    </Flex>

    <Flex bgColor="gray.200" p={2}>
      <InputGroup size='lg'>
        <Input
          bgColor="white"
          size="lg"
          placeholder="honey"
          value={newItem}
          onChange={updateNewItem}
        />
        <InputRightElement>
          <IconButton icon={<AddIcon />} onClick={addNewItem} isDisabled={newItem.length == 0}/>
        </InputRightElement>
      </InputGroup>
    </Flex>
  </Flex>
}
