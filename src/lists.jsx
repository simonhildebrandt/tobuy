import React, { useState } from 'react';

import {
  Flex,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text
} from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { useFirestoreCollection, addRecord } from './firebase';
import ListDetails from './list-details';


export default function({user}) {
  const { data, loaded } = useFirestoreCollection(`lists`, [['owners', 'array-contains', user.uid], ['deletedAt', '==', null]]);
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

  function handleKeyDown(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      addNewItem();
    }
  }

  if (!loaded) return <Spinner/>;

  const items = Object.entries(data);

  return <Flex flexDir="column" flexGrow={1} overflowY="auto">
    { items.length == 0 && (
      <Flex m="auto" p={4} flexDir="column" align="center">
        <Text>No lists added yet - try adding one at the bottom.</Text>
        <ArrowDownIcon mt={4}/>
      </Flex>
    ) }

    <Flex flexDir="column" flexGrow={1}>
      { items.map(([id, item]) => (
        <ListDetails key={id} id={id} item={item}/>
      )) }
    </Flex>

    <Flex bgColor="gray.200" p={2}>
      <InputGroup size='lg'>
        <Input
          bgColor="white"
          size="lg"
          placeholder="new list"
          value={newItem}
          onChange={updateNewItem}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          <IconButton icon={<AddIcon />} onClick={addNewItem} isDisabled={newItem.length == 0}/>
        </InputRightElement>
      </InputGroup>
    </Flex>
  </Flex>
}
