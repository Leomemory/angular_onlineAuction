import { Component, OnInit } from '@angular/core';
import{ActivatedRoute} from '@angular/router';
import {Product, ProductService, Comment} from "../shared/product.service";
import { WebsocketService } from '../shared/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  /*productTitle:String;*/
  product: Product;
  comments:Comment[];

  newRating:number=5;
  newComment:string="";
  isCommentHidden:boolean=true;

  isWatched:boolean=false;
  currentBid:number;
  subscription: Subscription;

  constructor(private routeInfo:ActivatedRoute,
              private productSerive:ProductService,
              private wsService:WebsocketService) { }

  ngOnInit() {
  	/*this.productTitle=this.routeInfo.snapshot.params["prodTitle"]*/
  	let productId:number = this.routeInfo.snapshot.params["productId"];
  	this.productSerive.getProduct(productId).subscribe(
      product=>{
        this.product=product
        this.currentBid=product.price;
      }
    );
  	this.productSerive.getCommentsForProductId(productId).subscribe(
      comments=>this.comments=comments
    );
  }

  addComment() {
    let comment = new Comment(1,this.product.id,new Date().toLocaleDateString(),'someone',this.newRating,this.newComment);
    this.comments.unshift(comment);

    let sum=this.comments.reduce((sum,comment)=>sum+comment.rating,0)
    this.product.rating=sum / this.comments.length;

    this.newComment=null;
    this.newRating = 5;
    this.isCommentHidden = true;
  }

  watchProduct(){
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    } else {
      var _this = this;
      this.isWatched=true;
      this.subscription = this.wsService.createObservableSocket("ws://localhost:8085",this.product.id).subscribe(products=>{
        console.log(JSON.parse(products));
        products =JSON.parse(products);
        _this.currentBid = products[0].bid
      });
    }
  }
}
