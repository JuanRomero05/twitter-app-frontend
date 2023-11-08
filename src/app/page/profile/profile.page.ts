import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  segment: String = 'home';

  tweets = [];

  showNewTweet = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://devdactic.fra1.digitaloceanspaces.com/twitter-ui/tweets.json').subscribe((data: any) => {
      console.log('tweets: ', data.tweets);
      this.tweets = data.tweets;
    })
  }

  openNewTweet() {
    this.showNewTweet = true;
  }

}
