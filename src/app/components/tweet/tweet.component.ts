import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { AlertController, IonModal } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetComponent implements OnInit {

  @Input() tweet: any;

  isModalOpen = false;

  replyForm: FormGroup;

  constructor(
    public alertController: AlertController,
    private http: HttpClient,
    public fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      'tweet-reply': new FormControl,
    })
  }

  ngOnInit() {
    this.parseTweet();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  parseTweet() {
    this.tweet.text = this.tweet.post_content.replace(/#[a-zA-Z]+/g, "<span>$&</span>");
    this.tweet.text = this.tweet.post_content.replace(/@[a-zA-Z]+/g, "<span>$&</span>");
  }

  postReply() {
    console.log('mira tonto estoy publicando un comentario estaticamente jjajajaja');

  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  formatDate = (timestamp: string) => {
    const formattedDate = new Date(timestamp).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour12: true
    });

    const [time, date] = formattedDate.split(', ');
    return `${date} - ${time}`;
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
