module.exports = app => {
  app.get("/", async (req, res) => {
    res.send('Bem-vindo(a) ao Gym Management API')
  });
}

var admin = require("firebase-admin");
var serviceAccount = require("../projetos-topes-2020-firebase-adminsdk-6ynnf-91302e2967.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projetos-topes-2020.firebaseio.com"
});