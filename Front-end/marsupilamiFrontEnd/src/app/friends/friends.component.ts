import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


export class Friend {
  constructor(
    public id : number,
    public name : string,
    public email : string,
    public password : string,
    public age : number,
    public family : string,
    public race : string,
    public food : string,
    public image : string,
    public user_id : number 
  ){

  }
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends : Friend[]; 
  constructor(private httpClient : HttpClient) { }

  ngOnInit(): void {
    this.getFriends();
  }

  getFriends(){
    this.httpClient.get<any>('http://localhost:8080/api/friends').subscribe(
      response => {
        console.log(response);
        this.friends = response;
      }
    );
  }

}
