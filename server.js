'use strict';
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();
const HP_API_URL = process.env.HP_API_URL;

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use('/public',express.static('public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


app.get('/', test);
app.get('/home', handelHome);
app.get('/house/:house', handelHomechar);
app.post('/charAdd', handelAddChar);
app.get('/fav', handelFav);
app.get('/char/:id',handelChar);
app.put('/char/:id',handelCharUpdate);
app.delete('/char/:id',handelCharDELETE);


function handelCharDELETE(req,res){

  let cahrID = req.params.id;

  let statment = `DELETE FROM users WHERE id=${cahrID};`;

  client.query(statment).then(data => {

    res.redirect(`/fav`);
  }).catch(error => {
    console.log('handelCharDELETE', error);
  });

}

function handelCharUpdate(req,res){
  let recvied = req.body;
  let cahrID = req.params.id;
  let statment = `UPDATE users  SET namecahr=$1, patround=$2 ,alive=$3  WHERE id=$4;`;
  let values = [recvied.name,recvied.patround,recvied.alive,cahrID];

  client.query(statment,values).then(data => {
    console.log(`/char/${cahrID}`);
    res.redirect(`/char/${cahrID}`);
  }).catch(error => {
    console.log('handelCharUpdate', error);
  });


}

function handelChar(req,res){

  let cahrID = req.params.id;
  let statment = `select * from users WHERE id =${cahrID} ;`;

  client.query(statment).then(data => {

    let datarecvideFromDB =data.rows[0];
    res.render('details',{ourChar : datarecvideFromDB});

  }).catch(error => {

    console.log('handelChar', error);
  });

}


function handelFav(req,res){

  let statment = `select * from users;`;

  client.query(statment).then(data => {

    let datarecvideFromDB =data.rows; 
    res.render('fav',{ourChar : datarecvideFromDB});

  }).catch(error => {

    console.log('handelFav', error);
  });

}

function handelAddChar(req, res) {

  let datarecvide = req.body;

  let statment = `INSERT INTO users(namecahr, patround, alive, img) VALUES($1,$2,$3,$4) RETURNING  *;`;
  let values = [datarecvide.name, datarecvide.patround, datarecvide.alive, datarecvide.img];

  client.query(statment,values).then(data => {

    console.log('added to DB', data);

    res.redirect('/fav');

  }).catch(error => {

    console.log('handelAddChar', error);
  });


}


function handelHomechar(req, res) {

  let homename = req.params.house;
  console.log(homename);
  let url = `http://hp-api.herokuapp.com/api/characters/house/${homename}`;

  superagent.get(url).then(data => {

    let datarecvide = data.body;

    let arryOfCharacter = datarecvide.map(ele => {

      return new Character(ele);

    });

    res.render('characters', { ourChar: arryOfCharacter });
    //    res.send(arryOfCharacter);

  }).catch(error => {

    console.log('handelHomechar', error);
  });


  //   res.render('home');
}

function Character(character) {
  this.name = character.name;
  this.patround = character.patronus;
  this.alive = character.alive;
  this.img = character.image;
  this.student=character.hogwartsStudent;
}



function handelHome(req, res) {


  res.render('home');

}



function test(req, res) {

  res.send('aghyad');
}
// ----------------------
// ------- Routes -------
// ----------------------


// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------



// -----------------------------------
// --- CRUD Pages Routes functions ---
// -----------------------------------



// Express Runtime
client.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
