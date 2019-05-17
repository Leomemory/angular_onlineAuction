import { Component, OnInit } from '@angular/core'
import { Product, ProductService } from '../shared/product.service'
import{ FormControl } from '@angular/forms'
import { Observable } from "rxjs";
import { debounceTime,distinctUntilChanged } from "rxjs/operators";
import 'rxjs/RX';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
	/*private products:Array<Product>;*/
	private products:Observable<Product[]>;
	
	private keyword:number;
	private titleFilter:FormControl=new FormControl();
	
	private imgUrl:string='http://placehold.it/300x150/';
  
  constructor(private productService:ProductService) {
  	this.titleFilter.valueChanges
  	.pipe(debounceTime(500),distinctUntilChanged())
  	.subscribe(
  		value=>this.keyword=value
  	);
  }

  ngOnInit() {
    this.products=this.productService.getProducts();
    this.productService.searchEvent.subscribe(
      params=>this.products = this.productService.search(params)
    );
  }
}