import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { AlertController, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetComponent implements OnInit {

  @Input() tweet: any;
  @Input() index: number;

  constructor(
    public alertController: AlertController,
    private http: HttpClient,
  ) {
    this.tweetModal = null as any
    this.index = 0
  }

  @ViewChild(IonModal) tweetModal: IonModal;

  ngOnInit() {
    this.parseTweet();
  }

  cancelTweetModal() {
    this.tweetModal.dismiss(null, 'cancel');
  }

  parseTweet() {
    this.tweet.text = this.tweet.post_content.replace(/#[a-zA-Z]+/g, "<span>$&</span>");
    this.tweet.text = this.tweet.post_content.replace(/@[a-zA-Z]+/g, "<span>$&</span>");
  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  handleLike = async (tweet: any) => {
    // se agrega o se elimina el like en la bd
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })
    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)
    const body = { user_id: id.value, post_id: tweet.post_id }

    this.http.post(env.api + 'likes', body, { headers: headers })
      .subscribe(() => {
        if (tweet.liked)
          tweet.post_likes--
        else
          tweet.post_likes++

        tweet.liked = !tweet.liked
      }, async (err) => {
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

}
