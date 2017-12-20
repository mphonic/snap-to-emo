import React from 'react';

import highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';

class EmoChart extends React.Component {
    
    constructor(props) {
        super(props);
        this.dataItems = [
            'anger',
            'fear',
            'happiness',
            'neutral',
            'sadness',
            'surprise'
        ];
    }

    initDatasets() {
        this.config = {
            xAxis: {
                categories: []
            },
            series: [],
            title: {
                text: "Emotion Chart"
            },
            credits: false
        };
        this.dataItems.forEach((item) => {
            this.config.series.push({
                data: [],
                name: item
            });
        });
    }

    getData() {
        let json = localStorage.getItem('emos');
        return JSON.parse(json);
    }

    makeADate(timestamp) {
        let date = new Date(timestamp);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(-2);
    }

    makeDatasets() {
        this.initDatasets();
        let data = this.getData();
        if (!data.emos.length) return false;
        let colorMap = {
            anger: '#FF0000',
            fear: '#00FF00',
            happiness: 'yellow',
            neutral: 'mediumslateblue',
            sadness: 'grey',
            surpise: 'pink'
        };
        data.emos.forEach((item) => {
            for(let key in item) {
                let index = this.dataItems.indexOf(key);
                if (index > -1) {
                    this.config.series[index].data.push(parseInt(item[key]));
                    this.config.series[index].color = colorMap[key];
                } else if (key === 'date' && this.config.xAxis.categories.indexOf(item[key]) === -1) {
                    this.config.xAxis.categories.push(this.makeADate(item[key]));
                }
            }
        });
        return true;
    }

    render() {
        let hasData = this.makeDatasets();
        let output = (hasData)?<ReactHighcharts config={this.config} />:'';
        return (
            <div>{output}</div>
        );
    }
}

module.exports = EmoChart;