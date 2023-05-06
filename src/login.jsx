import React, { useState, useRef } from 'react';

import {
  Button,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  CloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { sendSignInLink } from './firebase';


export default function Login() {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose
  } = useDisclosure();

  const inputRef = useRef();

  const [email, updateEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const setEmail = event => {
    updateEmail(event.target.value)
    setIsValid(true)
  }

  const onSubmit = event => {
    if (inputRef.current.checkValidity()) {
      sendSignInLink(email);
      onLoginClose()
      setIsSent(true);
    } else {
      setIsValid(false)
    }
  }

  return <Flex as="form" p={2} justify="center" onSubmit={onSubmit}>
    { !isLoginOpen && (
      isSent ? (
        <Text fontWeight="bold">Login email sent!</Text>
      ) : (
        <Button onClick={onLoginOpen}>Login</Button>)
      )
    }
    <motion.div
      initial="closed"
      transition={{ duration: 0.3 }}
      animate={isLoginOpen ? 'open' : 'closed'}
      variants={{
        open: { display: 'flex', width: "100%" },
        closed: { display: 'none', width: "0%" }
      }}
      style={{
        overflow: 'hidden',
        alignItems: 'center',
        padding: '8px',
        maxWidth: "600px"
      }}
    >
      <CloseButton onClick={onLoginClose} color="gray.200"/>
      <InputGroup>
        <Input
          ref={inputRef}
          isInvalid={!isValid}
          mx={1}
          type="email"
          value={email}
          placeholder="email address"
          onChange={setEmail}
        />
        <InputRightElement width="90px">
          <Button onClick={onSubmit} size="sm" colorScheme={isValid ? 'green' : 'red'}>Submit</Button>
        </InputRightElement>
      </InputGroup>
    </motion.div>
  </Flex>
}
