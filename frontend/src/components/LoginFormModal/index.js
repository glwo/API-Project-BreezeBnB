import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // useEffect(() => {
  //   let newErrors = []
  //   if(password.length < 6){
  //     newErrors.push("password must exceed six characters")
  //   }
  // })

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const demolitionUser = (e) => {
    e.preventDefault();
    dispatch(
      sessionActions.login({
        credential: 'demo@user.io',
        password: 'password'
      })
    )
    .then(closeModal())
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  }

  return (
    <>
    <div className="logInModal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div>
        <label>
          Username or Email :
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <label>
          Password :
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
        <div>
        <button className="loginModalButtons" type="submit">Log In</button>
        </div>
        <div>
        <button className="loginModalButtons" type="submit" onClick={demolitionUser}>Demo User Login</button>
        </div>
      </form>
      </div>
    </>
  );
}

export default LoginFormModal;
