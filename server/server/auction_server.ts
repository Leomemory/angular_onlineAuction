import * as express from 'express';

const ws_1 = require('ws');

const app=express();

export class Product {
    constructor(public id: number,
                public title: string,
                public  price: number,
                public rating: number,
                public desc: string,
                public categories: Array<string>) {
    }
}

export class Comment{
    constructor(public id:number,
                public productId:number,
                public timestamp:string,
                public user:string,
                public rating:number,
                public content:string){
    }
}

const products:Product[]= [
    new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品，是我在学习慕课网Angular入门实战时创建的', ['图画']),
    new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品，是我在学习慕课网Angular入门实战时创建的', ['游戏']),
    new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品，是我在学习慕课网Angular入门实战时创建的', ['图书']),
    new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品，是我在学习慕课网Angular入门实战时创建的', ['音乐']),
    new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品，是我在学习慕课网Angular入门实战时创建的', ['音乐']),
    new Product(6, '第五个商品', 6.99, 2.5, '这是第六个商品，是我在学习慕课网Angular入门实战时创建的', ['游戏'])
];

const comments:Comment[]=[
    new Comment(1,1,"2017-09-26 22:22:22","张三",5,"东西不错"),
    new Comment(2,1,"2017-03-26 22:22:22","李四",3,"东西是不错"),
    new Comment(3,4,"2017-04-26 22:22:22","王五",4,"东西很不错"),
    new Comment(4,2,"2017-05-26 22:22:22","赵六",2,"东西非常不错"),
    new Comment(5,2,"2017-05-26 22:22:22","赵云",2,"东西非常不错"),
    new Comment(6,3,"2017-05-26 22:22:22","炉石",2,"东西非常不错"),
    new Comment(7,5,"2017-05-26 22:22:22","拉司法所",2,"东西还行"),
    new Comment(8,5,"2017-05-26 22:22:22","东方红",2,"非常不错")
];

app.get('/',(req,res)=>{ res.send("Hello Express"); }); 
app.get('/api/products',(req,res)=>{ 
    let result = products;
    let params = req.query;
    if(params.title){
        result=result.filter((p)=>p.title.indexOf(params.title)!==-1);
    }
    if(params.price && params.price !== 'null' && result.length>0){
        result = result.filter((p)=>p.price<=parseInt(params.price));
    }
    if(params.category && params.category !=="-1" && result.length>0){
        result = result.filter((p)=>p.categories.indexOf(params.category)!==-1);
    }
    res.json(result);
 }); 
app.get('/api/product/:id', (req, res) => { res.json(products.find((product) => product.id == req.params.id)); });
app.get('/api/product/:id/comments', (req,res)=>{ res.json(comments.filter((comment:Comment)=>comment.productId == req.params.id)) });
const server=app.listen(8888,"localhost",()=>{ console.log("服务器已启动，地址是：http://localhost:8888"); });


//关注的商品id集合
const subscription = new Map<any, number[]>();
const wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", websocket=> {
    websocket.on("message",  message =>{
        var messageObj = JSON.parse(message);
        var productIds = subscription.get(websocket) || [];
        subscription.set(websocket, productIds.concat([messageObj.productId]));
    });
});

//价格集合
var currentBids = new Map<number, number>();
//每两秒更新价格
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscription.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);

