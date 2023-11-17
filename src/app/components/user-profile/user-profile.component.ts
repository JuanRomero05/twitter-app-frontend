import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal, AlertController, IonLoading } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {

  @Input() user: any
  @Input() modalTrigger: any

  @ViewChild('loading') loading: IonLoading;
  @ViewChild('followingModal') modalFollowing: IonModal;
  @ViewChild('followersModal') modalFollowers: IonModal;

  segment: String = 'posts';
  token: string | null = ''
  id: string | null = ''
  header: HttpHeaders = new HttpHeaders()

  following = [];
  followers = [];
  tweets = [];
  replies = [];
  likes = [];

  noDataTweets = false;
  noDataReplies = false;
  noDataLikes = false;

  constructor(    
    private http: HttpClient,
    public alertController: AlertController
  ) {
    this.modalFollowing = null as any
    this.modalFollowers = null as any
    this.loading = null as any
  }

  ngOnInit() {}

  
  cancelModalFollowing() {
    this.modalFollowing.dismiss(null, 'cancel');
  }

  cancelModalFollowers() {
    this.modalFollowers.dismiss(null, 'cancel');
  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }
}
