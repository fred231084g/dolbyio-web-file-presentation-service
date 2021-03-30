import React, { Component } from "react";
import PropTypes from "prop-types";

import VoxeetSDK from "@voxeet/voxeet-web-sdk";

import Loading from "./loading";

import "../styles/login.less";


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            conferenceName: 'conf-' + Math.round(Math.random() * 10000),
            userName: 'Guest ' + Math.round(Math.random() * 10000),
            file: null,
            canJoinConference: true,
            canStartPresentation: false,
            isLoading: false,
            loadingMessage: ''
        };

        this.onFilePresentationConversionProgress = this.onFilePresentationConversionProgress.bind(this);
        this.onFilePresentationConverted = this.onFilePresentationConverted.bind(this);

        this.handleChangeConferenceName = this.handleChangeConferenceName.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        this.handleChangePresentationFile = this.handleChangePresentationFile.bind(this);

        this.joinPresentation = this.joinPresentation.bind(this);
        this.startPresentation = this.startPresentation.bind(this);
    }

    componentDidMount() {
        VoxeetSDK.filePresentation.on("conversionProgress", this.onFilePresentationConversionProgress);
        VoxeetSDK.filePresentation.on("converted", this.onFilePresentationConverted);
    }

    componentWillUnmount() {
        VoxeetSDK.filePresentation.removeListener("conversionProgress", this.onFilePresentationConversionProgress);
        VoxeetSDK.filePresentation.removeListener("converted", this.onFilePresentationConverted);
    }

    onFilePresentationConversionProgress(fileConversionProgress) {
        const percentage = fileConversionProgress.currentStep * 100 / fileConversionProgress.stepCount;

        this.setState({
            isLoading: true,
            loadingMessage: `Converting the presentation - ${percentage.toFixed(0)}%`
        });

        console.log(fileConversionProgress);
    }

    onFilePresentationConverted(fileConverted) {
        console.log("fileConverted", fileConverted);
        this.props.handleOnSessionOpened(this.state.conferenceName, this.state.userName, fileConverted);
    }


    handleChangeConferenceName(e) {
        const canJoinConference = e.target.value.length > 0 && this.state.userName.length > 0;

        this.setState({
            conferenceName: e.target.value,
            canJoinConference: canJoinConference,
            canStartPresentation: canJoinConference && this.state.file != null
        });
    }

    handleChangeUserName(e) {
        const canJoinConference = e.target.value.length > 0 && this.state.conferenceName.length > 0;

        this.setState({
            userName: e.target.value,
            canJoinConference: canJoinConference,
            canStartPresentation: canJoinConference && this.state.file != null
        });
    }

    handleChangePresentationFile(e) {
        const file = e.target.files[0];
        console.log('Selected PowerPoint file', file);

        const canJoinConference = e.target.value.length > 0 && this.state.conferenceName.length > 0;

        this.setState({
            file: file,
            canStartPresentation: canJoinConference && file != null
        });
    }


    openSession() {
        this.setState({
            isLoading: true,
            loadingMessage: 'Opening a session'
        });

        return VoxeetSDK
            .session
            .open({
                name: this.state.userName,
                externalId: this.state.userName,
                avatarUrl: "https://gravatar.com/avatar/" + Math.floor(Math.random() * 1000000) + "?s=200&d=identicon",
            });
    }

    joinPresentation() {
        this.openSession()
            .then(() => {
                this.props.handleOnSessionOpened(this.state.conferenceName, this.state.userName);
            })
            .catch((e) => {
                this.setState({ isLoading: false });
                console.log(e);
            });
    }

    startPresentation() {
        this.openSession()
            .then(() => {
                this.setState({
                    isLoading: true,
                    loadingMessage: 'Uploading the presentation'
                });

                VoxeetSDK
                    .filePresentation
                    .convert(this.state.file)
                    .then((result) => {
                        if (result.status == 200) {
                            this.setState({
                                isLoading: true,
                                loadingMessage: 'Converting the presentation'
                            });
                        } else {
                            this.setState({ isLoading: false });
                            console.log('There was an error while uploading the file.');
                        }
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

    render() {
        if (this.state.isLoading) {
            return <Loading message={this.state.loadingMessage} />;
        }

        return (
            <div className="login container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-5">
                        <div className="card card-lg mb-5">
                            <div className="card-body">
                                <div className="text-center">
                                    <h1>Conference</h1>
                                </div>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="input-conference-name">Conference name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="input-conference-name"
                                            value={this.state.conferenceName}
                                            onChange={this.handleChangeConferenceName} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="input-user-name">Your name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="input-user-name"
                                            value={this.state.userName}
                                            onChange={this.handleChangeUserName} />
                                    </div>
                                    
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-block btn-primary"
                                        onClick={this.joinPresentation}
                                        disabled={!this.state.canJoinConference}>
                                        Join Presentation
                                    </button>

                                    <div className="form-group custom-file">
                                        <input type="file" className="custom-file-input" id="input-file" onChange={this.handleChangePresentationFile} />
                                        <label className="custom-file-label" htmlFor="input-file">Choose PowerPoint file</label>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-block btn-primary"
                                        onClick={this.startPresentation}
                                        disabled={!this.state.canStartPresentation}>
                                        Start Presentation
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    handleOnSessionOpened: PropTypes.func
};

Login.defaultProps = {
    handleOnSessionOpened: null
};

export default Login;