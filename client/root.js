import React, { Component } from "react";

import VoxeetSDK from "@voxeet/voxeet-web-sdk";

import Loading from "./components/loading";
import Login from "./components/login";
import Conference from "./components/conference";

export default class Root extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            loadingMessage: 'Loading...',
            isLoggedIn: false,
            isHost: false,
            fileConverted: null
        };

        this.onSessionOpened = this.onSessionOpened.bind(this);
    }

    componentDidMount() {
        this.getAccessToken()
            .then(accessToken => VoxeetSDK.initializeToken(accessToken, this.getAccessToken) )
            .then(() => {
                console.log('SDK Initialized');
                this.setState({ isLoading: false });
            });

        // Remove the bottom left link from Google Chrome
        // From: https://stackoverflow.com/a/28206011
        $("body").on('mouseover', 'a', function (e) {
            var $link = $(this),
                href = $link.attr('href') || $link.data("href");
        
            $link.off('click.chrome');
            $link.on('click.chrome', () => window.location.href = href)
                .attr('data-href', href)
                .css({ cursor: 'pointer' })
                .removeAttr('href');
        });
    }

    async getAccessToken() {
        const url = '/access-token';
        const response = await fetch(url);
        const jwt = await response.json();

        return jwt.access_token;
    }

    onSessionOpened(conferenceName, userName, fileConverted) {
        console.log("Conf Name", conferenceName);
        console.log("User Name", userName);

        if (fileConverted) {
            console.log("Converted file", fileConverted);

            this.createConference(conferenceName)
                .then(conference => {
                    this.joinConference(conference.conferenceId, conference.ownerToken)
                        .then(c => {
                            this.setState({
                                isLoading: false,
                                isLoggedIn: true,
                                isHost: true,
                                fileConverted: fileConverted
                            });
                        })
                        .catch((e) => {
                            this.setState({ isLoading: false });
                            console.log(e);
                        });
                })
                .catch((e) => {
                    this.setState({ isLoading: false });
                    console.log(e);
                });
        } else {
            this.getInvited(conferenceName)
                .then(invitation => {
                    this.joinConference(invitation.conferenceId, invitation.accessToken)
                        .then(c => {
                            this.setState({
                                isLoading: false,
                                isLoggedIn: true,
                                isHost: false
                            });
                        })
                        .catch((e) => {
                            this.setState({ isLoading: false });
                            console.log(e);
                        });
                })
                .catch((e) => {
                    this.setState({ isLoading: false });
                    console.log(e);
                });
        }
    }


    async getInvited(conferenceName) {
        this.setState({
            isLoading: true,
            loadingMessage: 'Request access to the conference'
        });

        const externalId = VoxeetSDK.session.participant.info.externalId;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                conferenceName: conferenceName,
                externalId: externalId
            })
        };

        // Request our backend for an invitation
        const invitation = await fetch('/get-invited', options)
        return invitation.json();
    }

    async createConference(conferenceName) {
        this.setState({
            isLoading: true,
            loadingMessage: 'Creating the conference'
        });

        const externalId = VoxeetSDK.session.participant.info.externalId;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                alias: conferenceName,
                ownerExternalId: externalId
            })
        };

        // Request our backend to create a conference
        const response = await fetch('/conference', options);
        return response.json();
    }

    async joinConference(conferenceId, conferenceAccessToken) {
        this.setState({
            isLoading: true,
            loadingMessage: 'Joining the conference'
        });

        const conference = await VoxeetSDK.conference.fetch(conferenceId);

        // See: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/model/joinoptions
        const joinOptions = {
            conferenceAccessToken: conferenceAccessToken,
            constraints: {
                audio: true,
                video: false
            },
            maxVideoForwarding: 6
        };

        // 2. Join the conference
        await VoxeetSDK.conference.join(conference, joinOptions);
    }

    
    render() {
        if (this.state.isLoading) {
            return <Loading message={this.state.loadingMessage} />;
        }

        if (!this.state.isLoggedIn) {
            return <Login
                handleOnSessionOpened={(conferenceName, userName, fileConverted) => this.onSessionOpened(conferenceName, userName, fileConverted)} />;
        }

        return <Conference
            isHost={this.state.isHost}
            fileConverted={this.state.fileConverted} />;
    }
}