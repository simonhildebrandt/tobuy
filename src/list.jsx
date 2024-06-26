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
import {
  AddIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  CheckCircleIcon,
  CloseIcon
} from '@chakra-ui/icons';
import { arrayMoveImmutable } from 'array-move';

import ItemList from './item-list';
import Suggestions from './suggestions';

import { useFirestoreDocument, updateRecord } from './firebase';

export default ({listId, user}) => {
  const path = `lists/${listId}`;

  useEffect(_ => {
    updateRecord(`/users/${user.uid}`, {lastList: listId});
  }, []);

  const pageRef = useRef();

  const { data, loaded } = useFirestoreDocument(path);
  const [newItem, setNewItem] = useState('');
  const [cachedItems, setCachedItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const defaultSuggestions = cachedItems.filter(item => item.completed).slice(0, 4);
  const suggestions = newItem.length > 0 ? cachedItems.filter(i => i.name.toLocaleLowerCase().includes(newItem.toLocaleLowerCase())) : defaultSuggestions;

  if (!loaded) return <Spinner/>;

  function updateNewItem(e) {
    setNewItem(e.target.value);
  }

  function clearNewItem() {
    setNewItem("");
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

  function handleUpdate(id, data) {
    const index = cachedItems.findIndex(item => item.id == id);
    cachedItems[index] = {...cachedItems[index], ...data};
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
    setTimeout(_ => {
      const el = document.getElementById(`item-${id}`)
      el?.scrollIntoView({behavior: 'smooth'})
    }, 100);
  }

  function scrollTo(index) {
    scrollToId(cachedItems[index].id);
  }

  function toggleHideCompleted() {
    const sortedItems = hideCompleted ? cachedItems : cachedItems.toSorted((a, b) => a.completed - b.completed);
    updateRecord(
      path, {
        hideCompleted: !hideCompleted,
        items: sortedItems
      }
    );
  }

  function suggestionClicked({id, completed}) {
    if (completed && hideCompleted) {
      toggleHideCompleted();
    }
    scrollToId(id);
  }

  const newItemFocused = _ => setShowSuggestions(true);
  const newItemBlurred = _ => setTimeout(_ => setShowSuggestions(false), 100);

  return <Flex flexDir="column" height="100%" overflow="hidden" position="relative">
    <Flex position="absolute" style={{right: "20px", top: "130px", width: "40px"}} flexDir="column" gap={[2]}>
      <IconButton icon={<ArrowUpIcon/>} onClick={_ => scrollTo(0)}/>
      <IconButton icon={hideCompleted ? <CheckIcon/> : <CheckCircleIcon/> } onClick={toggleHideCompleted}/>
      <IconButton icon={<ArrowDownIcon/>} onClick={_ => scrollTo(displayItems.length - 1)}/>
    </Flex>

    <Flex bgColor="gray.200" p={2} alignItems="center">
      <InputGroup size='lg'>
        <Input
          bgColor="white"
          size="lg"
          placeholder="new item"
          value={newItem}
          onChange={updateNewItem}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          onFocus={newItemFocused}
          onBlur={newItemBlurred}
        />
        <InputRightElement>
          <IconButton display={newItem.length > 0 ? 'block' : 'none'} icon={<CloseIcon />} onClick={clearNewItem}/>
        </InputRightElement>
      </InputGroup>
      <IconButton ml={1} icon={<AddIcon />} onClick={addNewItem} isDisabled={newItem.length == 0}/>
    </Flex>
    <Suggestions
      show={showSuggestions}
      suggestions={suggestions}
      onSuggestionClick={suggestionClicked}
    />

    <Flex flexDir="column" flexGrow={1} overflowY="auto" ref={pageRef}>
      <Box id="item-list-top"/>

      { cachedItems.length == 0 && (
        <Flex m="auto" p={4} flexDir="column" align="center">
          <Text>No items added yet - try adding one at the top.</Text>
          <ArrowUpIcon mt={4}/>
        </Flex>
      ) }
      <ItemList
        items={displayItems}
        onReorder={handleDragEnd}
        onComplete={handleComplete}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </Flex>
    </Flex>
}
