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

  token: string | null = ''

  header: HttpHeaders = new HttpHeaders() 

  showNewTweet = false;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    this.token = token.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    this.getFeed().subscribe((data: any) => {
      this.tweets = data
    })
  }

  async handleRefresh(event: any) {
    this.getFeed().subscribe((data: any) => {
      this.tweets = data
      event.target.complete()
    })
  }
  
  getFeed() {
    return this.http.get(env.api+'tweets?offset=0&limit=10', { headers: this.header })
  }


  openNewTweet() {
    this.showNewTweet = true;
  }
}
