import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"

import { Row, FormGroup, FormControl,  Button,  } from 'react-bootstrap';

import './App.css';
import ChatBox from "./ChatBox.js"

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };
    }

    setUsername(username) {
        this.setState({username: username});
    }

    setPassword(password){
        this.setState({password: password});
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    login = async(e) => {
        // prevent web page refresh
        e.preventDefault();

        // GET request here

        alert("You are successfully signed in...");
        //window.location.href = "/ChatBox"

        }

    componentDidUpdate() {
        //console.log(this.state);
    }

    render() {

        const { username, password } = this.state;

        return (
            <div className="Login">
                <h1>Login</h1>
                <form className="userinput" onSubmit={ (e) => this.login(e)}>
                    <FormGroup controlId="username">
                        <FormControl 
                            type="text" 
                            value={username} 
                            name="username" 
                            onChange={e => this.setUsername(e.target.value)}
                            placeholder="Username" />
                    </FormGroup>

                    <FormGroup controlId="password">
                        <FormControl 
                            type="password" 
                            value={password} 
                            name="password" 
                            onChange={e => this.setPassword(e.target.value)}
                            placeholder="Password" />
                    </FormGroup>

                    <Button
                        type="submit" 
                        disabled={!this.validateForm()}
                        bsStyle="primary">Sign-In
                    </Button>
                </form>
                <Link to="/Register">Sign Up!</Link>
            </div>
        );
    }
}

export default LoginPage;