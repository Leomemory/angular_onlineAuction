import { Injectable,EventEmitter  } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import { URL } from 'url';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  // private products:Product[]=[
  //   new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品，是我在学习慕课网Angular入门实战时创建的', ['电子产品']),
  //   new Product(2, '第二个商品', 2.99, 2.5, '这是第二个商品，是我在学习慕课网Angular入门实战时创建的', ['电子产品', '硬件设备']),
  //   new Product(3, '第三个商品', 3.99, 4.5, '这是第三个商品，是我在学习慕课网Angular入门实战时创建的', ['图书']),
  //   new Product(4, '第四个商品', 4.99, 1.5, '这是第四个商品，是我在学习慕课网Angular入门实战时创建的', ['电子产品']),
  //   new Product(5, '第五个商品', 5.99, 3.5, '这是第五个商品，是我在学习慕课网Angular入门实战时创建的', ['硬件设备']),
  //   new Product(6, '第六个商品', 6.99, 2.5, '这是第六个商品，是我在学习慕课网Angular入门实战时创建的', ['家电产品'])
  // ]
  
  // private comments:Comment[]=[
  //   new Comment(1,1,"2017-09-26 22:22:22","张三",5,"东西不错"),
  //   new Comment(2,1,"2017-03-26 22:22:22","李四",3,"东西是不错"),
  //   new Comment(3,4,"2017-04-26 22:22:22","王五",4,"东西很不错"),
  //   new Comment(4,2,"2017-05-26 22:22:22","赵六",2,"东西非常不错"),
  //   new Comment(5,2,"2017-05-26 22:22:22","赵云",2,"东西非常不错"),
  //   new Comment(6,3,"2017-05-26 22:22:22","炉石",2,"东西非常不错"),
  //   new Comment(7,5,"2017-05-26 22:22:22","拉司法所",2,"东西还行"),
  //   new Comment(8,5,"2017-05-26 22:22:22","东方红",2,"非常不错")
  // ]

  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http:Http) { }
  
  getAllCategories():string[]{
    return ['图画','音乐','图书','游戏'];
  }

  /**
   * 获取商品
   */
  getProducts():Observable<Product[]>{
    // return this.products;
    return this.http.get('/api/products').pipe(map(res=>res.json()))
  }
  
  /**
   * 返回商品 @param id 商品id
   */
  getProduct(id:number):Observable<Product>{
    // return this.products.find((product)=>product.id==id);
    return this.http.get('/api/product/' + id).pipe(map(res => res.json()))
  }
  
  /**
   * 返回商品评论
   * @param id 商品id
   */
  getCommentsForProductId(id:number):Observable<Comment[]>{
    // return this.comments.filter((comment:Comment)=>comment.productId==id);
    return this.http.get('/api/product/' + id + '/comments').pipe(map(res => res.json()))
  }
   
  search(params: ProductSearchParams): Observable<Product[]> {
    return this.http.get('/api/products', { search: this.encodeParams(params) }).pipe(map(res=>res.json()))
  }

  private encodeParams(params: ProductSearchParams) {
    return Object.keys(params)
      .filter((key) => params[key])
      .reduce((sum: URLSearchParams, key: string) => {
        sum.append(key, params[key]);
        return sum;
      }, new URLSearchParams());
  }
}

export class Product {
  constructor(public id: number,
              public title: string,
              public  price: number,
              public rating: number,
              public desc: string,
              public categories: Array<string>) {}
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

/* 封装搜索的类 */
export class ProductSearchParams {
  constructor(public title:string,
              public price:number,
              public category:string){
  }
}