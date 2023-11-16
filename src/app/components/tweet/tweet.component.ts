import { Component, Input, OnInit, ViewChild } from '@angular/core';
//import { ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { ActionSheetController, AlertController, IonModal } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class TweetComponent implements OnInit {

  @Input() tweet: any;
  @Input() isComment: any;

  isModalOpen = false;
  isModalProfileOpen = false;
  isModalFollowingOpen = false;
  isModalFollowersOpen = false;
  isModalEditReplyOpen = false;

  replyForm: FormGroup;
  replyEditForm: FormGroup;

  token: string | null = ''
  id: string | null = ''
  header: HttpHeaders = new HttpHeaders()
  exists: boolean = true
  canBeDeleted: boolean = false
  comments: any[] = []

  constructor(
    public alertController: AlertController,
    private http: HttpClient,
    public fb: FormBuilder,
    private actionSheetController: ActionSheetController,
  ) {

    this.replyForm = this.fb.group({
      'tweet-reply': new FormControl,
    })

    this.replyEditForm = this.fb.group({
      'edit-reply': new FormControl
    })
  }

  segment: string = 'postsProfile';

  isFollowing: boolean = false;

  async ngOnInit() {
    this.parseTweet();
    this.segment = 'postsProfile';

    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    this.token = token.value
    this.id = id.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${this.token}`)

    // se verifica si el usuario tiene permisos sobre el tweet
    if (this.tweet.user_id == this.id) {
      this.canBeDeleted = true
    }

    // si es un tweet, se buscan los comentarios del mismo
    if (!this.isComment)
      this.http.get(env.api + `tweets/${this.tweet.post_id}/comments`, { headers: this.header })
        .subscribe((data: any) => {
          this.comments = data
        }, async () => {
          const alert = await this.createAlert('Failure', 'Something went wrong while fetching tweets.')
          alert.present()
        })
  }

  handleFollow() {
    this.isFollowing = !this.isFollowing;
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModalProfile(isOpen: boolean) {
    this.isModalProfileOpen = isOpen
  }

  openModalFollowing(isOpen: boolean) {
    this.isModalFollowingOpen = isOpen
  }

  openModalFollowers(isOpen: boolean) {
    this.isModalFollowersOpen = isOpen
  }

  openModalEditReply(isOpen: boolean) {
    this.isModalEditReplyOpen = isOpen
  }

  async deleteTweet(tweet: any) {
    let resource = ''
    if (this.isComment) {
      resource = 'comments'
    } else {
      resource = 'tweets'
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Close?',
      subHeader: 'Are you sure you want to delete this tweet?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.http.delete(env.api + `${resource}/${tweet.post_id}`, { headers: this.header })
              .subscribe(() => {
                this.exists = false
              }, async (err) => {
                const alert = await this.createAlert('Failure', err.error.msg)
                alert.present()
              })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  parseTweet() {
    this.tweet.text = this.tweet.post_content.replace(/#[a-zA-Z]+/g, "<span>$&</span>");
    this.tweet.text = this.tweet.post_content.replace(/@[a-zA-Z]+/g, "<span>$&</span>");
  }

  postReply() {
    console.log('mira tonto estoy publicando un comentario estaticamente jjajajaja');

  }

  editReply() {
    console.log('el tonto de nuevo ve cm estoy editando un comentario estaticamente jajaja');

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
    const body = { user_id: this.id, post_id: tweet.post_id }

    this.http.post(env.api + 'likes', body, { headers: this.header })
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
