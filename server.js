const express = require('express');
const app = express();
const bodyParser = require('body-parser')


app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())



app.get('/', (req, res) => {
  // If logged in :
  res.render('index',{
    title: "Rev 2.0"
    });
});


app.post('/', function (req, res) {
  //Momentan fara baza de date
  if(req.body.username=="admin" && req.body.password=="admin")
    res.render('loggedin');

  res.render('index',{message: "Try again"}); // aici pot fi chestii de genul "Utilizator incorect" sau "User inexistent"
})




const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});