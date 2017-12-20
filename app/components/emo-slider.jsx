import React from 'react';
import { FormControl, ControlLabel } from 'react-bootstrap';

class EmoSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.label,
            value: this.props.emoValue
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.emoValue !== this.state.value) {
            this.setState({ value: newProps.emoValue * 100 });
        }
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    getValue() {
        return this.state.value;
    }

    render() {
        return (
            <ControlLabel>{this.props.label}
                <FormControl className={this.props.label} type="range" name={this.props.label} value={this.state.value} onChange={this.handleChange} min="0" max="100" step="any" />
            </ControlLabel>
        );
    }
}

module.exports = EmoSlider;