import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  /*filterField是告诉是要根据商品的标题进行过滤还是价格。。。。
    keyword就是搜索框中输入的东西*/
   
  transform(list: any[], filterField: string, keyword:number): any {
    /*如果没有传进来*/
    if(!filterField || !keyword){
    	return list;
    }
    
    return list.filter(item=>{
    	let fieldValue=item[filterField]
    	/*return fieldValue.indexOf(keyword)>=0;*/
    	return fieldValue>=keyword;
    })
  }

}
