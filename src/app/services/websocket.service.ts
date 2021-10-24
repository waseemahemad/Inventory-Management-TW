import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { Config } from '../commons/config';


@Injectable()
export class WebsocketService {

  private subscriptionOnline: Subscription;
  private subscriptionOffline: Subscription;
  public onlineUser: Observable<Message>;
  public offlineUser: Observable<Message>;
  private receivedNotification = new Subject<any>();

  private onlineUserData = new Subject<any>();
  private offlineUserData = new Subject<any>();
  private notificationLive : Subscription;
  public messages: Observable<Message>;

  constructor(private config: Config, private stompRService: StompRService) { }


  connectWebSocket(authToken) {
    if(authToken!=null){
      this.stompRService.config = this.stompConfigMethod(authToken);
      this.stompRService.initAndConnect();    
    }    
    // Stream of messages
    this.onlineUser = this.stompRService.subscribe('/chat/online');    
    this.subscriptionOnline = this.onlineUser.subscribe(this.online_user);

    this.offlineUser = this.stompRService.subscribe('/chat/offline');    
    this.subscriptionOffline = this.offlineUser.subscribe(this.offline_user);

    this.messages = this.stompRService.subscribe('/user/queue/notify');
    // Subscribe a function to be run on_next message
    this.notificationLive = this.messages.subscribe(this.on_next);
  }


  stompConfigMethod(authToken): StompConfig {
    return {
      // Which server?
      url: this.config._urlWebSocket,

      // Headers
      // Typical keys: login, passcode, host
      headers: {
        authToken: authToken
      },

      // How often to heartbeat?
      // Interval in milliseconds, set to 0 to disable
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 5000 (5 seconds)
      reconnect_delay: 5000,

      // Will log diagnostics on console
      debug: false
    };
  }

  disConnectWebSocket() { this.stompRService.disconnect(); }

  public on_next = (message: Message) => {   
    console.log("message =>"+message.body);
    this.changeNotification(JSON.parse(message.body));
  }

  public online_user = (message : Message) =>{
    this.sendOnlineUser(message.body);     
  }

  public offline_user = (message : Message) =>{
    this.sendOfflineUser(message.body);
  }

  receivedNotification$ = this.receivedNotification.asObservable();
  changeNotification(notification: Notification) {
    this.receivedNotification.next(notification);
  }

  onlineUser$ = this.onlineUserData.asObservable();
  sendOnlineUser(message : any){
    let liveUserName : any[] = [];
    if(message instanceof Array){
      liveUserName = message;
    } else {
      liveUserName.push(message);
    }
    this.onlineUserData.next(message);
  }

  offlineUser$ = this.offlineUserData.asObservable();
  sendOfflineUser(message : any){    
    this.offlineUserData.next(message);
  }

}
