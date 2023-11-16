import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Preferences } from '@capacitor/preferences';
import { environment as env } from 'src/environments/environment';
import { IonLoading } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segment: String = 'home';

  tweets: any[] = [];

  offset: number

  limit: number

  token: string | null = ''

  header: HttpHeaders = new HttpHeaders() 

  showNewTweet = false;

  constructor(private http: HttpClient) {
    this.loading = null as any
    this.offset = 0
    this.limit = 10
  }

  @ViewChild('loading') loading: IonLoading;

  async ngOnInit() {
  }

  // cada vez que se accede al componente, se recargan los datos
  async ionViewWillEnter(){
    this.loading.present()

    const token = await Preferences.get({ key: 'token' })
    this.token = token.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    this.fetchTweets(()=>{
      this.offset = this.offset + this.limit
      this.loading.dismiss(null, 'cancel')
    })
  }

  async ionViewWillLeave(){
    this.tweets = []
    this.offset = 0
  }

  async handleRefresh(event: any) {
    this.tweets = []
    this.offset = 0
    this.fetchTweets(()=>{
      event.target.complete()
    })
  }

  handleScroll(event: any) {
    this.fetchTweets(() => {
      this.offset = this.offset + this.limit
      console.log(this.offset)
      event?.target.complete()
    })
  }

  fetchTweets(end: Function) {
    this.http.get(env.api+`tweets?offset=${this.offset}&limit=${this.limit}`, { headers: this.header }).subscribe((data: any) => {
      this.tweets = [...this.tweets, ...data]
      end()
    })
  }

  openNewTweet() {
    this.showNewTweet = true;
  }
}
