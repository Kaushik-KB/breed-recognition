const firebaseConfig = {
  apiKey: "AIzaSyAf3ZapGoaYCT_Eo_gPqDXePSPb0G9_xVc",
  authDomain: "breed-ddef4.firebaseapp.com",
  projectId: "breed-ddef4",
  storageBucket: "breed-ddef4.firebasestorage.app",
  messagingSenderId: "1064725291680",
  appId: "1:1064725291680:web:03a8273fb7edb37430dfc5",
};

// This function sends prediction data to your Firebase Cloud Function.
async function savePredictionToFirebase(predictionData) {
  // You can find your cloud function URL in the Firebase console in the functions tab.
  // It will look something like this:
  // https://<your-region>-<your-project-id>.cloudfunctions.net/savePrediction
  const cloudFunctionUrl = 'https://us-central1-breed-ddef4.cloudfunctions.net/savePrediction';

  // The user's ID token is needed for security rules if you want to secure the function
  // For now, based on your rules, any authenticated user can write to the predictions collection.
  // const idToken = await firebase.auth().currentUser.getIdToken();

  try {
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      // headers: {
      //   'Authorization': 'Bearer ' + idToken,
      //   'Content-Type': 'application/json'
      // },
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(predictionData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Prediction saved successfully:', result);
    } else {
      console.error('Failed to save prediction:', await response.text());
    }
  } catch (error) {
    console.error('Error saving prediction:', error);
  }
}

// Example of how you might use it after getting a prediction
// from your Teachable Machine model.

// let model, webcam, labelContainer, maxPredictions;
// ... (your existing Teachable Machine setup code) ...

// async function predict() {
//   ...
//   const prediction = await model.predict(webcam.canvas);
//   ...

  // Assuming 'prediction' is the array of predictions from your model
  // and you have the user's data.
  const top3Predictions = prediction
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .map(p => ({ breed: p.className, probability: p.probability.toFixed(4) }));

  const user = firebase.auth().currentUser;

  if (user) {
    const predictionData = {
      user_id: user.uid,
      image_url: "url_of_the_uploaded_image", // You need to get this URL after uploading the image to Firebase Storage
      top3_predictions: top3Predictions,
      chosen_breed: top3Predictions[0].breed, // Default to the top prediction
      action: 'confirm'
    };

    await savePredictionToFirebase(predictionData);
  } else {
    console.log("User not logged in. Cannot save prediction.");
  }
// }


firebase.initializeApp(firebaseConfig);
