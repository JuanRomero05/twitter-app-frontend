import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GetResult, Preferences } from '@capacitor/preferences';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    
  constructor(private http: HttpClient) {}

  // por defecto, el buscador se situa en usuarios
  segment: String = 'users';

  query: string = '';

  token: string | null = ''

  header: HttpHeaders = new HttpHeaders()

  users: any[] = [];

  tweets: any[] = [];

  async findTweets(order: string) {
     // agregar loading
    this.tweets = [] // se reinicia la busqueda

    this.http.get(
      env.api+`tweets?content=${this.query}&order=${order}`, 
      { headers: this.header })
      .subscribe((data: any) => {
        this.tweets = data
      })
  }


  async handleInput(event: any) {
    // agregar loading
    this.query = event.target.value.toLowerCase();

    if (this.query === '')
      return 
    
    // se hace la busqueda de tweets y usuarios por simultaneo
    this.http.get(env.api+`users?search=${this.query}`, { headers: this.header })
      .subscribe((data: any) => {
        this.users = data
      })

    // los tweets se ordenan en reciente por defecto
    await this.findTweets('new')
  }

  
  clearResults() {
    this.users = []
    this.tweets = []
  }

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    this.token = token.value

    this.header = new HttpHeaders().append('Authorization', `Bearer ${this.token}`)
  }

  async mostRecents() {
    await this.findTweets('new')
  }

  async lessRecents() {
    await this.findTweets('old')
  }

  async topLiked() {
    await this.findTweets('popular')
  }
}
