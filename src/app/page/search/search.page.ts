import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment as env } from 'src/environments/environment';
import { AlertController, IonLoading } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    
  constructor(
    public alertController: AlertController,
    private http: HttpClient
  ) {
    this.loading = null as any;
    this.offsetTweet = 0
    this.offsetUser = 0
    this.limit = 10
    this.order = 'new'
  }

  // por defecto, el buscador se situa en usuarios
  segment: String = 'users';

  query: string = '';

  token: string | null = ''

  header: HttpHeaders = new HttpHeaders()

  offsetTweet: number

  offsetUser: number
  
  limit: number

  order: string

  users: any[] = [];

  tweets: any[] = [];

  @ViewChild('loading') loading: IonLoading;

  async handleInput(event: any) {
    this.offsetTweet = 0 // se reinicia la paginacion
    this.offsetUser = 0

    this.clearResults()

    this.query = event.target.value.toLowerCase();

    if (this.query === '')
      return 

    // se hace la busqueda de tweets y usuarios por simultaneo
    this.fetchUsers(()=>{
      this.offsetUser += this.limit
    })

    // los tweets se ordenan en reciente por defecto
    this.fetchTweets(()=>{
      this.offsetTweet += this.limit
    })
  }

  handleScroll(event: any) {
    if (this.segment === 'users') {
      this.fetchUsers(()=>{
        this.offsetUser += this.limit
        event?.target.complete()
      })
    } 

    if (this.segment === 'tweets') {
      this.fetchTweets(()=>{
        this.offsetTweet += this.limit
        event?.target.complete()
      })
    }
  }
  

  fetchUsers(success: Function){
    this.loading.present()
    
    this.http.get(env.api+`users?search=${this.query}&offset=${this.offsetUser}&limit=${this.limit}`, { headers: this.header })
      .subscribe((data: any) => {
        this.users = [...this.users, ...data]
        this.loading.dismiss(null, 'cancel')
        success()
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

  fetchTweets(success: Function) {
    this.loading.present()

    this.http.get(
      env.api+`tweets?content=${this.query}&order=${this.order}&offset=${this.offsetTweet}&limit=${this.limit}`, 
      { headers: this.header })
      .subscribe((data: any) => {
        this.tweets = [...this.tweets, ...data]
        this.loading.dismiss(null, 'cancel')
        success()
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
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

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  mostRecents() {
    this.offsetTweet = 0 // se reinicia la paginacion
    this.tweets = []
    this.order = 'new'
    this.fetchTweets(()=>{
      this.offsetTweet += this.limit
    })
  }

  lessRecents() {
    this.offsetTweet = 0 // se reinicia la paginacion
    this.tweets = []
    this.order = 'old'
    this.fetchTweets(()=>{
      this.offsetTweet += this.limit
    })
  }

  topLiked() {
    this.offsetTweet = 0 // se reinicia la paginacion
    this.tweets = []
    this.order = 'popular'
    this.fetchTweets(()=>{
      this.offsetTweet += this.limit
    })
  }
}