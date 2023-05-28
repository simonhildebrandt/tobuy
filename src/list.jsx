import React, { useState, useCallback, useEffect, useRef } from 'react';

import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { AddIcon, ArrowUpIcon, ArrowDownIcon, CheckIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { arrayMoveImmutable } from 'array-move';

import ItemList from './item-list';
import Suggestions from './suggestions';

import { useFirestoreDocument, updateRecord } from './firebase';

export default ({listId, user}) => {
  const path = `lists/${listId}`;

  const pageRef = useRef();

  const { data, loaded } = useFirestoreDocument(path);
  const [newItem, setNewItem] = useState('');
  const [cachedItems, setCachedItems] = useState([]);

  useEffect(() => {
    if (data) {
      setCachedItems(data.items);
    }
  }, [data]);

  const { hideCompleted } = data || {};
  const displayItems = hideCompleted ? cachedItems.filter(x => !x.completed) : cachedItems;

  const handleDragEnd = useCallback((result) => {
    const newItems = arrayMoveImmutable(cachedItems, result.source.index, result.destination.index);
    updateItems(newItems);
  });

  const suggestions = newItem.length > 0 ? cachedItems.filter(i => i.name.includes(newItem)) : [];
  console.log({newItem, suggestions, cachedItems});

  useEffect(_ => {
    console.log('new suggestion!', {newItem, suggestions})
    if (suggestions.length > 0) {
      scrollToId(suggestions[0].id);
    }
  }, [newItem]);

  if (!loaded) return <Spinner/>;

  function updateNewItem(e) {
    setNewItem(e.target.value);
  }
  function addNewItem() {
    const newItems = [{
      id: new Date().valueOf().toString(),
      name: newItem,
      addedAt: new Date().valueOf(),
      addedBy: user.uid,
      completed: false,
    }, ...cachedItems];

    updateItems(newItems);
    setNewItem('');
    scrollToId('list-top');
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

  function scrollToId(id) {
    console.log('scrolling', {id})
    setTimeout(_ => {
      const el = document.getElementById(`item-${id}`)
      console.log('finally scrolling')
      el?.scrollIntoView({behavior: 'smooth'})
    }, 100);
  }

  function scrollTo(index) {
    scrollToId(cachedItems[index].id);
  }

  function toggleHideCompleted() {
    const sortedItems = cachedItems;
    if (hideCompleted) {
      sortedItems.sort((a, b) => a.completed - b.completed);
    }
    updateRecord(
      path, {
        hideCompleted: !hideCompleted,
        items: sortedItems
      }
    );
  }

  function suggestionClicked({id, completed}) {
    console.log("suggestion clicked", {id});
    if (completed && hideCompleted) {
      toggleHideCompleted();
    }
    scrollToId(id);
  }

  return <Flex flexDir="column" height="100%" overflow="hidden" position="relative">
    <Flex position="absolute" style={{right: "30px", bottom: "130px", width: "40px"}} flexDir="column" gap={[2]}>
      <IconButton icon={<ArrowUpIcon/>} onClick={_ => scrollTo(0)}/>
      <IconButton icon={hideCompleted ? <CheckIcon/> : <CheckCircleIcon/> } onClick={toggleHideCompleted}/>
      <IconButton icon={<ArrowDownIcon/>} onClick={_ => scrollTo(displayItems.length - 1)}/>
    </Flex>

    <Flex flexDir="column" flexGrow={1} overflowY="auto" ref={pageRef}>
      <Box id="item-list-top"/>

      { cachedItems.length == 0 && (
        <Flex m="auto" p={4} flexDir="column" align="center">
          <Text>No items added yet - try adding one at the bottom.</Text>
          <ArrowDownIcon mt={4}/>
        </Flex>
      ) }
      <ItemList
        items={displayItems}
        onReorder={handleDragEnd}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </Flex>
    <Suggestions suggestions={suggestions} onSuggestionClick={suggestionClicked} />
    <Flex bgColor="gray.200" p={2}>
      <InputGroup size='lg'>
        <Input
          bgColor="white"
          size="lg"
          placeholder="new item"
          value={newItem}
          onChange={updateNewItem}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <InputRightElement>
          <IconButton icon={<AddIcon />} onClick={addNewItem} isDisabled={newItem.length == 0}/>
        </InputRightElement>
      </InputGroup>
    </Flex>
    </Flex>
}
