const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const RSA = require("hybrid-crypto-js").RSA;
const Crypt = require("hybrid-crypto-js").Crypt;

// var publicKey;
// var privateKey;
// function generateKeys() {
//   var rsa = new RSA();
//   rsa.generateKeyPair(function(keyPair) {
//       publicKey = keyPair.publicKey;
//       privateKey = keyPair.privateKey;
//   });
//   setTimeout(function () {
//     console.log('publicKey', publicKey);
//     console.log('privateKey', privateKey);
//   }, 3000);
// }

// generateKeys();

let crypt = new Crypt();

// Env variables
require('dotenv').config();
const privatekey = process.env.PRIVATEKEY;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb+srv://user:pass@mycluster.mdt5xzz.mongodb.net/ToDoList?retryWrites=true&w=majority", {useNewUrlParser: true});

const dbURI = "mongodb+srv://zenil:zenil@mycluster.mdt5xzz.mongodb.net/ToDoList?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error({ err }));

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});

app.post("/", function(req, res){

  const itemName = crypt.decrypt(privatekey, req.body.newItem).message;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

app.get("/about", function(req, res){
  res.render("about");
});
