const emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise'];
const initScore = {},
    emotionStringMap = {};

emotions.forEach(function(i) {
    initScore[i] = 0;
    emotionStringMap[i] = i.substr(0,1).toUpperCase() + i.substr(1);
});


module.exports = Object.freeze({
    emotions: emotions,
    emotionStringMap: emotionStringMap,
    initScore: initScore
});