import React from 'react';
import { Redirect, Link } from "react-router-dom"
import * as firebase from "firebase/app";
import { FormGroup, FormControl, Button, } from 'react-bootstrap';

import '../../constants/styles.css';
import * as ROUTES from '../../constants/routes.js'
import ChatBox from './ChatBox';
require('firebase/auth')

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            conversationId: "",
            redirect: false,
            conversations: [],
        };
    }

    async componentDidMount() {
        // check for user authentication
        await this.props.firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // set intial states for username, conversationId
                this.setState({ email: this.props.user.email });
                // get chatlog
                this.loadConversations(user);
            } else {
                // redirect back to login page
                this.setState({ redirect: true });
            }
        }.bind(this));
    }

    loadConversations(user) {
        this.props.firebase.database().ref(
            'users/'
            + user.uid
            + '/conversations/'
        ).orderByChild("created").once("value", function (convos) {
            // this.setState({chatlog: chatlog.val()});
            var formattedarray = [];
            var retrievedconvos = convos.val();
            for (var key in retrievedconvos) {
                formattedarray.push({ name: key });
                // console.log(retrievedconvos[key]["thread"]);
            }
            this.setState({ conversations: formattedarray })
            console.log(formattedarray);
        }.bind(this))
    }

    setConversation(conversationId) {
        this.setState({ conversationId });
        console.log(conversationId);
    }

    logOut(e) {
        this.props.firebase.auth().signOut().then(function () {
            this.setState({ redirect: true });
        }.bind(this)).catch(function (error) {
            // An error happened.
            alert(error);
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={ROUTES.LOGIN} />;
        } else {
            return (
                <div className="Chatpage">
                    <div className="conversationlist">
                        <div className="toolbar">
                            <div className="left-items">
                                <Button>Settings</Button>
                            </div>
                            <h1>Bots</h1>
                            <div className="right-items">
                                <Button>+</Button>
                            </div>
                        </div>
                        <div className="conversations">
                            {
                                this.state.conversations.map(conversation => (
                                    <div className="conversation-list-item" onClick={e => { this.setConversation(conversation.name) }}>
                                        <div className="conversation-info">
                                            <h1 className="conversation-title">{conversation.name}</h1>
                                            {/* <p className="conversation-snippet">{conversation.lastmessage}</p> */}
                                        </div>
                                    </div>
                                )
                                )
                            }
                        </div>
                        <div className="bottombar">
                            <Button onClick={e => { this.logOut(e) }}>Log Out</Button>
                        </div>
                    </div>
                    <div className="chatbox">
                        <ChatBox {...this.props} {...this.state} key={this.state.conversationId} />
                    </div>
                </div>
            );
        }
    }

}

export default Chat;