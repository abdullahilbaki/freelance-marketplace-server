const admin = require("firebase-admin");
const serviceAccount = require("./freelance-marketplace-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
