import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import IndividualSpot from "./components/IndividualSpot";
import UpdateSpotForm from "./components/UpdateSpotForm";
import CreateReviewForm from "./components/CreateReviewForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path={'/Spots/:id/update'}>
            <UpdateSpotForm />
          </Route>
          <Route exact path={'/Spots/:id/createReview'}>
            <CreateReviewForm />
          </Route>
          <Route path={'/Spots/:id'}>
            <IndividualSpot />
          </Route>

          <Route exact path={'/'}>
            <HomePage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
