import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  ws: WebSocket;

  constructor() { }

  createObservableSocket(url: string,id:number): Observable<any> {
      this.ws = new WebSocket(url);

      return new Observable<string>(
        observer =>{
            //什么时候发生下一个元素
            this.ws.onmessage = (event) => observer.next(event.data);
            //什么时候抛一个异常
            this.ws.onerror = (event) => observer.error(event);
            //什么时候发出流结束的信号
            this.ws.onclose = (event) => observer.complete();

            this.ws.onopen =(event)=> this.sendMessage({productId:id})
            return () => this.ws.close();
        }
      );
  }

  sendMessage(message:any){
    this.ws.send(JSON.stringify(message));
  }
}
