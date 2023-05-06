import React, { useReducer } from 'react';

import { ChakraProvider, Spinner } from '@chakra-ui/react'

import List from './list';

import { withUser, handleSigninLink } from './firebase';
import { useRouter } from './router';
import Page from './page';
import  Lists from './lists';


const routeDefaults = { page: null }

function getPageForRoute(state, user) {
  const { page, id } = state;

  switch(page) {
    case 'lists':
      return <Lists user={user} />
    case 'show':
      return <List listId={id} user={user}/>;
    default:
      "loading"
  }
}

export default () => {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )

  useRouter(router => {
    router.on("/login", () => {
      console.log("logging in!")
      handleSigninLink()
    })
    .on("/", () => {
      setRouterState({page: "lists"})
    })
    .on("/lists/:id", ({data: {id}}) => {
      setRouterState({page: "show", id})
    })
    .resolve()
  })

  const user = withUser();

  const page = getPageForRoute(routerState, user);

  console.log({user, page})

  if (user == null) return <Spinner/>

  return <ChakraProvider>
    <Page user={user} page={page}/>
  </ChakraProvider>
}
