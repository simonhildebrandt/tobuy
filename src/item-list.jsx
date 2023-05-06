import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Flex, Text, Checkbox, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import ListItem from './list-item';

export default ({items, onReorder, onComplete, onDelete}) => {
  return <DragDropContext onDragEnd={onReorder}>
    <Droppable droppableId="shoppinglist">
      {(droppable) => (
        <Flex
          flexDir="column"
          ref={droppable.innerRef}
          {...droppable.droppableProps}
          height="100%"
          p={[8]}
        >
          { items.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={item.id}
              index={index}
            >
              {(draggable) => (
                <Flex
                  ref={draggable.innerRef}
                  {...draggable.draggableProps}
                  {...draggable.dragHandleProps}
                  fontSize={[24]}
                  flexDir="column"
                  pb={[4]}
                >
                  <ListItem
                    item={item}
                    onComplete={onComplete}
                    onDelete={onDelete}
                  />
                </Flex>
              )}
            </Draggable>
          ))}

          {droppable.placeholder}
        </Flex>
      )}
    </Droppable>
  </DragDropContext>
}
