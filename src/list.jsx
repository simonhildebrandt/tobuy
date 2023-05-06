import React, { useState, useCallback, useEffect } from 'react';

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { arrayMoveImmutable } from 'array-move';

import ItemList from './item-list';
import { useFirestoreDocument, updateRecord } from './firebase';

export default ({listId, user}) => {
  const path = `lists/${listId}`;

  const { data, loaded } = useFirestoreDocument(path);
  const [newItem, setNewItem] = useState('');
  const [cachedItems, setCachedItems] = useState([]);

  useEffect(() => {
    if (data) {
      setCachedItems(data.items);
    }
  }, [data]);

  const handleDragEnd = useCallback((result) => {
    const newItems = arrayMoveImmutable(cachedItems, result.source.index, result.destination.index);
    updateItems(newItems);
  });

  if (!loaded) return <Spinner/>;

  function updateNewItem(e) {
    setNewItem(e.target.value);
  }
  function addNewItem() {
    const newItems = [...cachedItems, {
      id: new Date().valueOf().toString(),
      name: newItem,
      addedAt: new Date().valueOf(),
      addedBy: user.uid,
      completed: false,
    }];

    updateItems(newItems);
    setNewItem('');
  }

  function handleComplete(id, completed) {
    const index = cachedItems.findIndex(item => item.id == id);
    cachedItems[index].completed = completed;
    updateItems(cachedItems);
  }

  function handleDelete(id) {
    const index = cachedItems.findIndex(item => item.id == id);
    cachedItems.splice(index, 1);
    updateItems(cachedItems);
  }

  function updateItems(newItems) {
    updateRecord(path, {items: newItems});
    setCachedItems(newItems);
  }

  function handleKeyDown(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      addNewItem();
    }
  }

  return <>
    <Flex flexDir="column" flexGrow={1} overflowY="auto">
      <ItemList
        items={cachedItems}
        onReorder={handleDragEnd}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </Flex>
    <Flex bgColor="gray.200" p={2}>
      <InputGroup size='lg'>
        <Input
          bgColor="white"
          size="lg"
          placeholder="honey"
          value={newItem}
          onChange={updateNewItem}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          <IconButton icon={<AddIcon />} onClick={addNewItem} isDisabled={newItem.length == 0}/>
        </InputRightElement>
      </InputGroup>
    </Flex>
  </>
}
