"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require('ws');
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品，是我在学习慕课网Angular入门实战时创建的', ['图画']),
    new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品，是我在学习慕课网Angular入门实战时创建的', ['游戏']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品，是我在学习慕课网Angular入门实战时创建的', ['图书']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品，是我在学习慕课网Angular入门实战时创建的', ['音乐']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品，是我在学习慕课网Angular入门实战时创建的', ['音乐']),
    new Product(6, '第五个商品', 6.99, 2.5, '这是第六个商品，是我在学习慕课网Angular入门实战时创建的', ['游戏'])
];
var comments = [
    new Comment(1, 1, "2017-09-26 22:22:22", "张三", 5, "东西不错"),
    new Comment(2, 1, "2017-03-26 22:22:22", "李四", 3, "东西是不错"),
    new Comment(3, 4, "2017-04-26 22:22:22", "王五", 4, "东西很不错"),
    new Comment(4, 2, "2017-05-26 22:22:22", "赵六", 2, "东西非常不错"),
    new Comment(5, 2, "2017-05-26 22:22:22", "赵云", 2, "东西非常不错"),
    new Comment(6, 3, "2017-05-26 22:22:22", "炉石", 2, "东西非常不错"),
    new Comment(7, 5, "2017-05-26 22:22:22", "拉司法所", 2, "东西还行"),
    new Comment(8, 5, "2017-05-26 22:22:22", "东方红", 2, "非常不错")
];
app.get('/', function (req, res) { res.send("Hello Express"); });
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && params.price !== 'null' && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) { res.json(products.find(function (product) { return product.id == req.params.id; })); });
app.get('/api/product/:id/comments', function (req, res) { res.json(comments.filter(function (comment) { return comment.productId == req.params.id; })); });
var server = app.listen(8888, "localhost", function () { console.log("服务器已启动，地址是：http://localhost:8888"); });
//关注的商品id集合
var subscription = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.on("message", function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscription.get(websocket) || [];
        subscription.set(websocket, productIds.concat([messageObj.productId]));
    });
});
//价格集合
var currentBids = new Map();
//每两秒更新价格
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscription.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) {
                return ({
                    productId: pid,
                    bid: currentBids.get(pid)
                });
            });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);
