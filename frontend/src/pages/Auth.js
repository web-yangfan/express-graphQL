import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

  state = {
    isLogin: true
  }

  /* 
    创建一个静态 contextType，在render 中可以直接使用 this.context。
    this.context 值取决于 App.js中 AuthContext.Provider 组件传过来的值
    但是必须 引入 AuthContext
  */
  static contextType = AuthContext;
  
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }
    
    // 如果没有登陆
    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }
   

    fetch('http://localhost:4000/graphql', {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('failed!')
      }
      return res.json();
    }).then(resData => {
      if(resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        )
      }
    }).catch(error => {
      console.log(error);
    }) 
  }

  render() {
    return (
      <form className="auth-form" onSubmit = {this.submitHandler} >
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl}/>
        </div>

        <div className="form-control">
          <label htmlFor="password">password</label>
          <input type="password" id="password" ref={this.passwordEl}/>
        </div>

        <div className="form-actions">
        <button type="submit">提交</button>
          <button type="button" onClick={ this.switchModeHandler}> 
           请{ this.state.isLogin ? '注册' : '登陆' }
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;