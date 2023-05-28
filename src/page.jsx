import React from 'react';

import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { logout } from './firebase';



export default function({user, page}) {

  return <Flex bgColor="blue.400" width="100%" height="100%" flexDir="column">
    <Flex flexDir="column" mx="auto" minWidth={[400, 500, 600]} height="100%" bgColor="blue.200">
      <Flex
        pl={6}
        pr={2}
        py={2}
        bgColor="blue.100"
        justify="space-between"
        align="center"
      >
        <Heading size="md" color="blue.200"><Link href="/">RunToStore</Link></Heading>
        <Menu direction="rtl">
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant="ghost"
          />
          { user && <MenuList>
              <MenuItem onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          }
        </Menu>
      </Flex>

      {page}

    </Flex>
  </Flex>
}
