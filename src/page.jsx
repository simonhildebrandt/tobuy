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
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { logout } from './firebase';
import { navigate } from './router';


export default function({user, page}) {

  function handleLogout() {
    const url = new URL(window.location.href);
    logout().then(navigate('/?next=' + encodeURIComponent(url.pathname)))
  }

  return <Flex bgColor="blue.400" width="100%" height="100%" flexDir="column">
    <Flex flexDir="column" mx="auto" width={["100%", "100%", "48em"]} height="100%" bgColor="blue.200">
      <Flex
        pl={6}
        pr={2}
        py={2}
        bgColor="blue.100"
        justify="space-between"
        align="center"
      >
        <Heading size="md" color="blue.200"><Link href="/"><Image width="50px" src="/logo.svg"/></Link></Heading>
        <Menu direction="rtl">
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant="ghost"
          />
          { user && <MenuList>
              <MenuItem onClick={handleLogout}>
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
