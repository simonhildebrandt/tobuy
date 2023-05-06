import React from 'react';

import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon, AddIcon } from '@chakra-ui/icons';
import Login from './login';
import { logout } from './firebase';

const appName = "runtoStore";


export default function({user, page}) {

  if (user) {
    return <Flex bgColor="blue.400" width="100%" height="100%" flexDir="column">
      <Flex flexDir="column" mx="auto" minWidth="400px" height="100%" bgColor="blue.200">
        <Flex justify="flex-end" p={2} bgColor="blue.100">
          <Menu direction="rtl">
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
              variant="ghost"
            />
            <MenuList>
            <MenuItem as="a" href="/">
                All lists
              </MenuItem>
              <MenuItem onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {page}

      </Flex>
    </Flex>
  }

  return <Flex direction="column" align="stretch">
    <Flex direction="column" align="center" mx={6}>
      <Heading my={6}>Welcome to {appName}.</Heading>
      <Flex mb={6}>...the best shopping list app.</Flex>
    </Flex>
    <Login/>
  </Flex>

}
