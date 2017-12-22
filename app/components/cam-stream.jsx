import React from 'react';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import EmoForm from './emo-form.jsx';

const EMO_CREDENTIALS = require('../credentials/emotion-api.js');
const AppConfig = require('../config.js');

class CamStream extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            streaming: false,
            streamToApi: false,
            gotNoFace: false,
            score: AppConfig.initScore
        };
        this.video = null;
        this.canvas = null;
        this.destWidth = Math.min(window.innerWidth, 960);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                this.video.srcObject = stream;
                this.video.play();
            })
            .catch(err => {
                console.log(`Error initializing camera: ${err}`);
            });

        this.video.addEventListener('canplay', () => {
            if (!this.state.streaming) {
                let height = this.video.videoHeight / (this.video.videoWidth / this.destWidth);

                this.destHeight = height;
                this.snapContainer.style.width = `${this.destWidth}px`;
                this.snapContainer.style.height = `${height}px`;
                this.canvas.setAttribute('width', this.destWidth);
                this.canvas.setAttribute('height', height);
                this.setState({ streaming: true });
            }
        }, false);
    }

    snap() {
        if (!this.state.streaming) return;
        let context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.destWidth, this.destHeight);
        this.send();
        this.setState({ streamToApi: true });
    }

    start() {
        this.setState({ streamToApi: true });
        this.snap();
    }

    stop() {
        this.setState({ streamToApi: false });
    }

    send() {
        let data = this.canvas.toDataURL('image/jpeg');
        fetch(data)
            .then(res => res.blob())
            .then(blobData => {
                $.ajax({
                    url: EMO_CREDENTIALS.EMOTION_API_URL + $.param({}),
                    beforeSend: function (xhrObj) {
                        xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
                        xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', EMO_CREDENTIALS.EMOTION_API_KEY);
                    },
                    type: 'POST',
                    processData: false,
                    data: blobData
                })
                    .done(data => {
                        if (data.length < 1) {
                            this.setState({ gotNoFace: true });
                            return;
                        }
                        let results = data[0];
                        let face = results.faceRectangle;
                        this.setState({ score: results.scores });
                        this.drawFaceRectangle(face);
                        if (this.state.streamToApi) {
                            setTimeout(() => { this.snap(); }, 1500);
                        }
                    })
                    .fail(err => {
                        console.log(JSON.stringify(err));
                        this.setState({ gotNoFace: true });
                    })
            });
    }

    drawFaceRectangle(face) {
        let context = this.canvas.getContext('2d');
        context.beginPath();
        context.strokeStyle = "orange";
        context.lineWidth = "5";
        context.rect(face.left, face.top, face.width, face.height);
        context.stroke();
    }

    render() {
        let snapButton, snapText, form;

        if (this.state.streamToApi) {
            snapText = 'Stop Streaming';
        } else {
            snapText = 'Start Streaming';
        }
        if (this.state.streaming) {
            snapButton = <Button className="snap-snap" bsStyle="primary" onClick={() => (this.state.streamToApi) ? this.stop() : this.start()}>{snapText}</Button>
            form = <EmoForm score={this.state.score} isStreaming={this.state.streamToApi} />
        }

        return (
            <div className="cam-snap">
                <div className="snap-container" ref={(ref) => { this.snapContainer = ref; }}>
                    <video ref={(ref) => { this.video = ref; }}>Video stream not available. Use sliders manually.</video>
                    {snapButton}
                    <canvas className="set-behind" ref={(ref) => { this.canvas = ref; }}>
                    </canvas>
                </div>
                {form}
            </div>
        );
    }
}

module.exports = CamStream;