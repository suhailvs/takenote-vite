import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { LandingPage } from '../../client/components/LandingPage'
import { TakeNoteApp } from '../../client/containers/TakeNoteApp'
import { PublicRoute } from '../../client/router/PublicRoute'
import { PrivateRoute } from '../../client/router/PrivateRoute'
import { getAuth } from '../../client/selectors'
import { login } from '../../client/slices/auth'

const isDemo = true //process.env.DEMO

export const App: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { loading } = useSelector(getAuth)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _login = () => dispatch(login())

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    _login()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="la-ball-beat">
          <div />
          <div />
          <div />
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>TakeNote</title>
        <link rel="canonical" href="https://takenote.dev" />
      </Helmet>

      <Switch>
        {isDemo ? (
          <>
            <Route exact path="/app" component={LandingPage} />
            <Route path="/" component={TakeNoteApp} />
          </>
        ) : (
          <>
            <PublicRoute exact path="/" component={LandingPage} />
            <PrivateRoute path="/app" component={TakeNoteApp} />
          </>
        )}

        <Redirect to="/" />
      </Switch>
    </HelmetProvider>
  )
}
