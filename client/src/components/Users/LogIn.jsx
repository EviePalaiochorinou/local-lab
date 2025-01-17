import React, { useState } from 'react'
import express from "../../apis/express";
import './Users.css';

const UserLogIn = ({ setShowLogIn, setSession, setAlert }) => {
  
  const [formUser, setFormUser] = useState({
    username: "",
    password: ""
  })

  const authenticateUser = async (event) => {
    event.preventDefault()
    const { data } = await express.post('/login', {
    password: formUser.password,
    username: formUser.username
})
  localStorage.setItem('user', JSON.stringify(data))
  setSession(JSON.parse(localStorage.getItem('user')))
  const { username, location } = data.user
  setAlert({type: 'success', header: "Log in successful!", event: 'LOG_IN', username, location});
}

  function handleChange(event) { 
    const {value, name} = event.target
    setFormUser(prevUser => ({
    ...prevUser, [name]: value})
  )}

  return (
    <div className="user-form ui middle aligned center aligned grid">
      <div className="column">
    
        <h2 className="ui image header">
          <div className="content">
            Log in to your account
          </div>
        </h2>

        <form onSubmit={authenticateUser} className="ui large form" noValidate>
          <div className="ui stacked segment">
            
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input onChange={handleChange} text={formUser.username} name="username" placeholder="Username" value={formUser.username} required/>
              </div>
            </div> 

            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" onChange={handleChange} text={formUser.password} name="password" placeholder="Password" value={formUser.password} />
              </div>
            </div> 

            <button className="fluid ui large primary button">Log in</button>

            <div className='light-separator'></div>

            <div>
              <p>New here?</p>
              <p className="ui primary basic button" onClick={() => setShowLogIn(false)}>Create new account</p>
            </div> 

          </div>
        </form>
    
      </div>
    </div>
  
        
  );
}

export default UserLogIn
