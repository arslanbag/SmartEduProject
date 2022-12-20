const express = require('express');
const app = express();
const port = 4000;

//Router
app.get('/', (req,res) => {
    res.status(200).send('INDEX');
});

//Listen Port
app.listen(port, () => {
    console.log(`Server Numarali ${port} ile baslatildi`);
  });