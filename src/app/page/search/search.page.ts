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
  }

  // por defecto, el buscador se situa en usuarios
  segment: String = 'users';

  query: string = '';

  token: string | null = ''

  header: HttpHeaders = new HttpHeaders()

  users: any[] = [];

  tweets: any[] = [];

  @ViewChild('loading') loading: IonLoading;

  findTweets(order: string) {
    this.loading.present()

    this.tweets = [] // se reinicia la busqueda

    this.http.get(
      env.api+`tweets?content=${this.query}&order=${order}`, 
      { headers: this.header })
      .subscribe((data: any) => {
        this.tweets = data
        this.loading.dismiss(null, 'cancel')
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
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
    this.findTweets('new')
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

  async mostRecents() {
    this.findTweets('new')
  }

  async lessRecents() {
    this.findTweets('old')
  }

  async topLiked() {
    this.findTweets('popular')
  }
}