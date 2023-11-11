import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Preferences } from '@capacitor/preferences';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segment: String = 'home';

  tweets = [];

  showNewTweet = false;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)
    
    this.http.get(env.api+'tweets?offset=0&limit=10', { headers })
      .subscribe((data: any) => {
        this.tweets = data
    })
  }

  openNewTweet() {
    this.showNewTweet = true;
  }

}
