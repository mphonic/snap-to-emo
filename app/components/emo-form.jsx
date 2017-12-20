import React from 'react';
import EmoSlider from './emo-slider.jsx';
import EmoChart from './emo-chart.jsx';
import { Button } from 'react-bootstrap';

class EmoForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false
        }
        this.labelMap = {
            anger: 'Anger',
            fear: 'Fear',
            happiness: 'Happiness',
            neutral: 'Neutrality',
            sadness: 'Sadness',
            surprise: 'Surprise'
        }
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
        
        var scores = {
            anger: this.anger.getValue(),
            fear: this.fear.getValue(),
            happiness: this.happiness.getValue(),
            neutral: this.neutral.getValue(),
            sadness: this.sadness.getValue(),
            surprise: this.surprise.getValue(),
            date: Date.now()
        };
        let data = this.getStoredValues();
        if (data) {
            data = JSON.parse(data);
        } else {
            data = { "emos": [] }
        }
        this.setState({ hasSubmitted: true });
        data.emos.push(scores);
        this.saveValues(data);
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
            chart = '';
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
                    {sliders}
                    <Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.state.hasSubmitted}>Save Values</Button>
                </form>
            );
        }
        return (
            <div>
                {form}
                {chart}
            </div>
        );
    }
}

module.exports = EmoForm;