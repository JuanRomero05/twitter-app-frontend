import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  constructor(private http: HttpClient) {
    this.modal = null as any
  }

  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  segment: String = 'posts';

  tweets = [];

  showNewTweet = false;


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
