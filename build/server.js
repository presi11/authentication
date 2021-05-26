const express = require('express');

const jwt = require('jsonwebtoken');

const port = 3000;
const app = express();
app.get("/api", (req, res) => {
  res.json({
    mensaje: "NodeJs and JWT"
  });
});
app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    nombre: "Formol",
    email: "formoldog@gmail.com"
  };
  jwt.sign({
    user: user
  }, 'secretkey', {
    expiresIn: '60'
  }, (err, token) => {
    res.json({
      token: token //Esto se puede remplazar por solo token ya que cuando la k se llama igual que la v se puede poner solo 1

    });
  });
});
app.post("/api/posts", verifiedToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.send(403);
    } else {
      res.json({
        mensaje: "Post fue creado",
        authData: authData
      });
    }
  });
}); //Authorization: Bearer <token>

function verifiedToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader != 'undefined') {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(port, () => {
  console.log("SERVER RUNNING AT http://localhost:3000");
});