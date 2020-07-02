const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = process.env.PORT || 5000;
const productsFilename = __dirname + "/products.json";
const favouritesFilename = __dirname + "/favourites.json";

//Middleware
app.use(express.json());
app.use(cors());
function log(req, res, next){
    console.log(req.method + " Request at " + req.url);
    next();
}
app.use(log);

// Endpoints
// Products
app.get("/products", function (req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    });
});

app.get("/products/:id", function (req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        const product = JSON.parse(data)[req.params.id];
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(JSON.stringify(product));
    });
});

app.put("/products/:id", function (req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        let product = JSON.parse(data);
        product[req.params.id].name = req.body.name;
        product[req.params.id].amount = req.body.amount;
        product[req.params.id].checked = req.body.checked;
        fs.writeFile(productsFilename, JSON.stringify(product), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(product));
        });
    });
});

app.delete("/products/:id", function (req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        let product = JSON.parse(data);
        product.splice(req.params.id, 1);
        for(let i = 0; i < product.length; i++){
            product[i].id = i;
        }
        fs.writeFile(productsFilename, JSON.stringify(product), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(product));
        });
    });
});

app.delete("/products/", function(req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        let product = JSON.parse(data);
        product = [];
        fs.writeFile(productsFilename, JSON.stringify(product), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(product));
        });
    });
});

app.post("/products", function (req, res){
    fs.readFile(productsFilename, "utf8", function (err, data) {
        let product = JSON.parse(data);
        if (req.body.length != undefined){
            req.body.forEach(ingredient => {
                product.push({
                    id: product.length,
                    name: ingredient.name,
                    amount: ingredient.amount,
                    checked: ingredient.checked,
                });
            })
        }else {
          product.push({
            id: product.length,
            name: req.body.name,
            amount: req.body.amount,
            checked: req.body.checked,
          });  
        }
        fs.writeFile(productsFilename, JSON.stringify(product), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(product));
        });
    });
});

// favourites
app.get("/favourites", function (req, res){
    fs.readFile(favouritesFilename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    })
})

app.delete("/favourites/:id", function (req, res){
    fs.readFile(favouritesFilename, "utf8", function (err, data) {
        let favourite = JSON.parse(data);
        let index = favourite.map(function(e) { return e.idMeal; }).indexOf(req.params.id)
        favourite.splice(index, 1);
        fs.writeFile(favouritesFilename, JSON.stringify(favourite), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(favourite));
        })
    })
})

app.post("/favourites", function (req, res){
    fs.readFile(favouritesFilename, "utf8", function (err, data) {
        let fav = JSON.parse(data);
        if (fav.map(function(e) {return e.idMeal; }).indexOf(req.body.idMeal) == -1){
            fav.push(req.body);
        }
        fs.writeFile(favouritesFilename, JSON.stringify(fav), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(fav));
        })
    })
})


app.listen(port, () => console.log(`Server listening on port ${port}`));