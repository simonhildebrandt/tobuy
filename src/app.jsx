import React, { useReducer, useEffect } from 'react';

import { ChakraProvider, Spinner } from '@chakra-ui/react'

import List from './list';

import { withUser, getUserData } from './firebase';
import { useRouter, navigate } from './router';
import Page from './page';
import  Lists from './lists';
import Front from './front';


const routeDefaults = { page: null }

function getPageForRoute(state, user) {
  const { page, id } = state;

  if (user === false) return <Front/>;

  switch(page) {
    case 'lists':
      return <Lists user={user} />
    case 'show':
      return <List listId={id} user={user}/>;
    default:
      return <Front/>
  }
}

export default () => {
  const {user, loginData} = withUser();

  useEffect(_ => {
    const {next} = loginData || {};
    if (next) {
      navigate(next);
    }
  }, [loginData]);

  console.log({user, loginData})
  return user === null ? <Spinner/> : <UserResolved user={user}/>
}

function UserResolved({user}) {
  const [routerState, setRouterState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    routeDefaults
  )

  useRouter(router => {
    router.on("/", () => {
      setRouterState({page: "lists"})
    })
    .on("/last-list", () => {
      console.log('trying last-list')

      getUserData(user.uid).then(
        userData => {
          console.log({userData});
          const { lastList } = userData || {};
          navigate( lastList ? `lists/${lastList}` : '/');
        }
      )
    })
    .on("/lists/:id", ({data: {id}}) => {
      setRouterState({page: "show", id})
    })
    .resolve()
  })
  const page = getPageForRoute(routerState, user);


  console.log({user, page});

  return <ChakraProvider>
    <Page user={user} page={page}/>
  </ChakraProvider>;
}
