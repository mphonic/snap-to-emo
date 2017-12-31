# Azure Emotion API from Built-in Camera

This is a prototype Node.js and React app that captures an image or video stream from your built-in camera and analyzes it using Microsoft Azure's Emotion API. A history of emotion scores is plotted using Highcharts.

You'll need [Node.js](https://nodejs.org), and then you'll do some familiar things:


```
git clone https://github.com/mphonic/snap-to-emo.git

cd snap-to-emo

npm install
```

Having done that, you'll need to [get an Azure account and subscription keys to the Emotion API](https://azure.microsoft.com/en-us/try/cognitive-services/). These are both available at free tiers.

After signing up, create a copy of /app/credentials/emotion-api-default.js in the credentials folder, and name it emotion-api.js. Copy the subscription key and URL you receive into emotion-api.js:

*/app/credentials/emotion-api.js*
```
module.exports = Object.freeze({
    EMOTION_API_URL: 'your-subscription-url',
    EMOTION_API_KEY: 'your-api-key'
});
```

Then, run

```
npm run dev
```

A tab should open in your web browser at http://localhost:3000/build. If it doesn't, enter the URL manually in your browser (or check your terminal for error messages).

The page should be pretty self-explanatory. Once you allow access to your camera, an interface appears. Take a decent picture featuring your face and get your emotion scores, which should appear in the knobs below, unless the API can't recognize a face in the image. You can adjust the knobs if you disagree with the algorithmic assessment, and then save the data into localStorage. A chart will appear showing all of your saved scores (since this app uses localStorage, don't expect to keep a long-term record -- this is only a proof-of-concept).

There is also an option to stream video to the Emotion API by going to http://localhost:3000/build/?stream=1. Be advised that this sends many requests to the API, which will be added to your Azure account and might be halted due to exceeding rate limits. There is a setTimeout in the CamStream class that can slow down the rate of requests.
