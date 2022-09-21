const express = require("express")
const app = express();
const stocks = require("./stocks.json");
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => { 
  res.send("server running")
});

app.get("/stocks", (req, res) => {
    res.send(stocks)
})

app.delete("/stocks/:id", (req, res) => {
    if(req.params.id && stocks[req.params.id]) {
        hold = stocks[req.params.id];
        delete stocks[req.params.id]
        res.send(hold)
    } else {
      res.status(500).send({
        'error': "id is not valid"
      })
    }
})

app.listen(8080, () => {
  console.log("listening on port 8080")
})
