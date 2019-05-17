import { Component, OnInit ,Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
	 @Input()
  private rating:number = 0;
  private stars:boolean[];

  @Input()
  private readonly:boolean=true;  //默认为只读

  @Output()
  private ratingChange:EventEmitter<number> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes:SimpleChanges):void{
    /*this.stars =[false,true,true,false,true];*/
  	this.stars =[];
  	for(let i=1;i<=5;i++){
  		this.stars.push(i>this.rating)
  	}
  }

  clickStar(index:number){  
    if(!this.readonly){  //不是只读情况下，可编辑情况下，能点
      this.rating=index+1;
      // this.ngOnInit(); // 根据新的rating值将stars数组重新赋值
      this.ratingChange.emit(this.rating)
    }
  }

}
