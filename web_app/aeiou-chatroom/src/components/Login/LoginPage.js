import React from 'react';
import {Redirect, Link} from "react-router-dom"
import * as firebase from "firebase/app";
import {FormGroup, FormControl,  Button,  } from 'react-bootstrap';

import '../../constants/styles.css';
import * as ROUTES from '../../constants/routes.js'
require('firebase/auth')

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            redirect: false,
        };
    }

    setEmail(email) {
        this.setState({email: email});
    }

    setPassword(password){
        this.setState({password: password});
    }

    validateForm() {
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            return true;
        } else {
            return false;
        }
    }

    login = async(e) => {
        // prevent web page refresh
        e.preventDefault();
        e.stopPropagation();

        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            alert(errorMessage);
          });
          
        
    }

    googleLogin = (e) => {
        e.preventDefault();

        firebase.auth().signInWithPopup(this.props.GoogleAuthProvider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            this.props.user = user;
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.setState({redirect: true});
            }
        }.bind(this));
    }

    render() {

        const { email, password } = this.state;

        if (this.state.redirect) {
            return <Redirect push to={ROUTES.CONTROLPANEL} />;
        }

        return (
            <div className="Login">
                <h1>Login</h1>
                <form className="userinput" onSubmit={ (e) => this.login(e)}>
                    <FormGroup controlId="email">
                        <FormControl 
                            type="email" 
                            value={email} 
                            name="email" 
                            onChange={e => this.setEmail(e.target.value)}
                            placeholder="Email" />
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
                        disabled={!this.validateForm()}>
                                Sign-In
                    </Button>
                </form>
                <form className="googlesignin" onSubmit={(e) => (this.googleLogin(e))}>
                    <Button type="submit">
                        Sign In with Google
                    </Button>
                </form>
                <Link to={ROUTES.REGISTER}>Sign Up!</Link>
            </div>
        );
    }
}

export default LoginPage;