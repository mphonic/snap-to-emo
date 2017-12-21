import React from 'react';
import EmoSlider from './emo-slider.jsx';
import EmoChart from './emo-chart.jsx';
import { Button, Row, Col } from 'react-bootstrap';
import $ from 'jquery';

const AppConfig = require('../config.js');

class EmoForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false
        }
        this.labelMap = AppConfig.emotionStringMap;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearSavedValues = this.clearSavedValues.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.reset) {
            this.setState({ hasSubmitted: false });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        let scores = { date: Date.now() };
        AppConfig.emotions.forEach((i) => {
            scores[i] = this[i].getValue();
        });

        let data = this.getStoredValues();
        if (data) {
            data = JSON.parse(data);
        } else {
            data = { "emos": [] }
        }

        this.setState({ hasSubmitted: true });
        data.emos.push(scores);
        this.saveValues(data);
        $('html, body').animate({
            scrollTop: $('.emo-stats').offset().top
        }, 500);
    }

    getStoredValues() {
        return localStorage.getItem('emos');
    }

    saveValues(data) {
        let json = JSON.stringify(data);
        localStorage.setItem('emos', json);
    }

    clearSavedValues() {
        localStorage.setItem('emos', '');
        this.setState({ hasSubmitted: false });
        $('html, body').animate({
            scrollTop: $('.cam-snap').offset().top
        }, 500);
    }

    render() {
        let form, chart;
        
        if (this.state.hasSubmitted) {
            chart = (
                <div>
                    <EmoChart />
                    <Button bsStyle="info" onClick={this.clearSavedValues}>Clear History</Button>
                </div>
            );
        } else {
            let sliders = [],
                scores = this.props.score;
            for (let key in scores) {
                if (this.labelMap[key]) {
                    sliders.push(
                        <EmoSlider ref={(ref) => this[key] = ref} label={this.labelMap[key]} emoValue={scores[key]} key={key} />
                    );
                }
            }
            form = (
                <form className="emo-form" onSubmit={this.handleSubmit}>
                    <Row className="show-grid">
                        <Col sm={12} md={6}>
                            {sliders.slice(0, sliders.length / 2)}
                        </Col>
                        <Col sm={12} md={6}>
                            {sliders.slice(sliders.length / 2)}
                        </Col>
                    </Row>
                    <Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.state.hasSubmitted}>Save Values</Button>
                </form>
            );
        }
        return (
            <div className="emo-stats">
                {form}
                {chart}
            </div>
        );
    }
}

module.exports = EmoForm;