import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Flex } from '@chakra-ui/react';
import ListItem from './list-item';

export default ({items, onReorder, onComplete, onDelete, onUpdate}) => {
  return <DragDropContext onDragEnd={onReorder}>
    <Droppable droppableId="shoppinglist">
      {(droppable) => (
        <Flex
          flexDir="column"
          ref={droppable.innerRef}
          {...droppable.droppableProps}
          py={[8]}
          pl={[8]}
          pr={[24]}
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
                  id={`item-${item.id}`}
                  my={2}
                >
                  <ListItem
                    item={item}
                    onComplete={onComplete}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
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
