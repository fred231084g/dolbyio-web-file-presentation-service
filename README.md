# Dolby.io - File Presentation Service

This GitHub repo is a sample application that uses the [File Presentation Service](https://docs.dolby.io/interactivity/docs/js-client-sdk-filepresentationservice). It is using [React.JS](https://reactjs.org) as front end technology and [Node.JS](https://nodejs.org) as backend server.

## Introduction

This sample application allows you to start a webinar type of presentation when participants can upload a PowerPoint file and start a presentation. Then other people can join the presentation as participants or listeners.

![Start](wiki/start.png)

When you host a presentation, only you can control the slides. You have the possibility to navigate between the slides using the left and right arrow bellow the presentation slide, or directly by clicking on the slide thumbnail in the list of slides at the bottom of the screen.

![](wiki/rectangular-with-notes.png)

You can display the notes from each slides.

![](wiki/rectangular-without-notes.png)

Or not display them. The video can be rectangular.

![](wiki/round-with-notes.png)

Or a circle. All of this is configurable using React properties.

![](wiki/participant.png)

When you join as a participant, you can only see the current presentation slide and share your video and microphone. While connected as a listener, you can only see the current presentation slide but not share your camera and microphone.

## Where to start

Clone this repo:

```bash
git clone https://github.com/dolbyio-samples/dolbyio-web-file-presentation-service
```

In the folder you've created, run the following command to install all the package dependencies:

```bash
npm install
```

If you haven't done so already, create an account on [dolby.io](https://dolby.io/signup), it is free so do it today! Go to your dashboard and for the first application, get your `Consumer Key` and `Consumer Secret`.

Create a `.env` file at the root of this folder and insert your consumer key and secret like that:

```
CONSUMER_KEY=<Your consumer key>
CONSUMER_SECRET=<Your consumer secret>
LIVE_RECORDING=false
```

Compile the React.JS application with the command:

```bash
npm run build
```

Start the Node.JS server with this command:

```bash
npm run start
```

## Mixer Layout Application

This project automatically builds a custom Mixer Layout Application that you can use in your own projects. After you build the application, in the folder `dist_mixer`, you will find the two files you need to host for the mixer layout application. You can also directly use the one from this version of the repo by pointing the _Recording Mixer Layout URL_ setting from the Dolby.io dashboard to this URL:

```
https://dolbyio-samples.github.io/dolbyio-web-file-presentation-service/index.html
```

## Docker Image

You can build your own Docker image with this project using the command:

```bash
docker build -t fps .
```

To run the container, you must provide the two environment variables `CONSUMER_KEY` and `CONSUMER_SECRET`. And you can map the port 8081 of the container to your local port 80.
```bash
docker run --rm -it -p 80:8081/tcp --env "CONSUMER_KEY=<value>" --env "CONSUMER_SECRET=<value>" fps:latest
```

Now you should be able to access the application from this page: http://localhost

## Features

Here is the list of what you can do in this application:

-   Upload a PowerPoint presentation
-   Join as participant, guest or listener
-   Navigate through the slides
-   Extract the notes from the slides
-   Display or not the notes dynamically
-   3 different video layouts (Round, Vertical, Horizontal)
-   Record the conference
-   Use [Enhanced Conference Access Control](https://docs.dolby.io/interactivity/docs/guides-enhanced-conference-access-control) with the permissions set on the server side
-   Mixer layout
-   Docker image to run the application easily

## Open Source Projects

This sample application is using the following Open Source projects:

-   [FontAwesome](https://fontawesome.com)
-   [Bootstrap](https://getbootstrap.com)
-   [Google Fonts](https://fonts.google.com)
-   [JQuery](https://jquery.com)
-   [JSZip](https://stuk.github.io/jszip/)
