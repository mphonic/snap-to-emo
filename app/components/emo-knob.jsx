import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import TouchKnob from 'react-touch-knob';

class EmoKnob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.label,
            value: this.props.emoValue * 100
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.emoValue !== this.state.value) {
            this.setState({ value: newProps.emoValue * 100 });
        }
    }

    getValue() {
        return this.knob.getValue();
    }

    render() {
        return (
            <ControlLabel>
                <TouchKnob 
                    ref={ref => { this.knob = ref; }} 
                    class={"knob " + this.props.label} 
                    name={this.props.label} 
                    value={this.props.emoValue * 100} 
                    min={0} 
                    max={100} 
                    showNumber={true} />
                {this.props.label}
            </ControlLabel>
        );
    }
}

module.exports = EmoKnob;