const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.getBreeds = functions.https.onRequest(async (request, response) => {
  const snapshot = await db.collection("breeds").get();
  const breeds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  response.json(breeds);
});

exports.savePrediction = functions.https.onRequest(async (request, response) => {
  const data = request.body;
  const prediction = {
    user_id: data.user_id,
    image_url: data.image_url,
    top3_predictions: data.top3_predictions,
    chosen_breed: data.chosen_breed,
    action: data.action,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection("predictions").add(prediction);
  response.json({ result: "Prediction saved" });
});

exports.getHealthTips = functions.https.onRequest(async (request, response) => {
  const breedId = request.query.breedId;
  const snapshot = await db.collection("health_tips").where("breed_id", "==", breedId).get();
  const tips = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  response.json(tips);
});

exports.submitFeedback = functions.https.onRequest(async (request, response) => {
  const data = request.body;
  const feedback = {
    user_id: data.user_id,
    message: data.message,
    category: data.category,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection("feedback").add(feedback);
  response.json({ result: "Feedback submitted" });
});
