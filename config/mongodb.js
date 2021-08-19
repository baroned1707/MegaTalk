const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://admin:admin@megatalk.wz04f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; //uri connect mongodb
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    console.log(err.errmsg);
    client.close();
  }
  console.log("Connect MongoDB Done !");
});

module.exports = client;
