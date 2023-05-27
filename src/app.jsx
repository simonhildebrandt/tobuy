import React, { useReducer } from 'react';

import { ChakraProvider, Spinner } from '@chakra-ui/react'

import List from './list';

import { withUser, handleSigninLink } from './firebase';
import { useRouter } from './router';
import Page from './page';
import  Lists from './lists';
import Front from './front';


const routeDefaults = { page: null }

function getPageForRoute(state, user) {
  const { page, id } = state;

  if (user === null) return <Spinner/>;
  if (user === false) {
    if (page == "logging-in") {
      return 'logging in';
    } else {
      return <Front/>
    }
  }

  switch(page) {
    case "logging-in":
      return 'logging in...';
    case 'lists':
      return <Lists user={user} />
    case 'show':
      return <List listId={id} user={user}/>;
    default:
      return <Front/>
  }
}

export default () => {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )

  useRouter(router => {
    router.on("/login", () => {
      handleSigninLink();
      setRouterState({page: "logging-in"})
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

  console.log({user, page});

  return <ChakraProvider>
    <Page user={user} page={page}/>
  </ChakraProvider>;
}
