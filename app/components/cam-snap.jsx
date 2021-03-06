import React from 'react';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import EmoForm from './emo-form.jsx';

const EMO_CREDENTIALS = require('../credentials/emotion-api.js');
const AppConfig = require('../config.js');

class CamSnap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            streaming: false,
            showSubmit: false,
            disableSubmit: false,
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
        if (this.state.showSubmit) {
            this.clear();
        }
        let context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.destWidth, this.destHeight);
        this.setState({ showSubmit: true, disableSubmit: false });
    }

    send() {
        let data = this.canvas.toDataURL('image/jpeg');
        this.setState({ disableSubmit: true });
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
                            $('html, body').animate({
                                scrollTop: $('.cam-snap').offset().top
                            }, 500);
                            return;
                        }
                        let results = data[0];
                        let face = results.faceRectangle;
                        this.setState({ score: results.scores });
                        this.drawFaceRectangle(face);
                        $('html, body').animate({
                            scrollTop: $('.emo-stats').offset().top
                        }, 500);
                    })
                    .fail(err => {
                        console.log(JSON.stringify(err));
                        this.setState({ gotNoFace: true });
                    })
            });
    }

    clear() {
        if (!this.state.streaming) return false;
        let context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setState({ showSubmit: false, gotNoFace: false });
        this.hasCleared = true;
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
        let snapButton, submitButton, snapText, form, faceError;

        if (this.state.showSubmit) {
            if (!this.state.gotNoFace && !this.state.gotAFace) {
                submitButton = <Button className="snap-submit" bsStyle="success" onClick={() => this.send()} disabled={this.state.disableSubmit}>Get Emotion Scores</Button>
            }
            snapText = 'Take a Different Picture';
        } else {
            submitButton = '';
            snapText = 'Take Picture';
        }
        if (this.state.streaming) {
            snapButton = <Button className="snap-snap" bsStyle="primary" onClick={() => (this.state.showSubmit) ? this.clear() : this.snap()}>{snapText}</Button>
            form = <EmoForm score={this.state.score} reset={this.hasCleared} />
        }
        if (this.state.gotNoFace) {
            faceError = <div className="snap-error" onClick={() => this.clear()}>No face was detected. Try again?</div>
        }

        return (
            <div className="cam-snap">
                <div className="snap-container" ref={(ref) => { this.snapContainer = ref; }}>
                    <video ref={(ref) => { this.video = ref; }}>Video stream not available. Use sliders manually.</video>
                    {snapButton}
                    <canvas ref={(ref) => { this.canvas = ref; }}>
                    </canvas>
                    {submitButton}
                    {faceError}
                </div>
                {form}
            </div>
        );
    }
}

module.exports = CamSnap;