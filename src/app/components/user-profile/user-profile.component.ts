import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal, AlertController, IonLoading, ModalController } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {
  @Input() userId: any
  @Input() isProfileOpen: any

  @ViewChild(IonModal) mainModal: IonModal;
  @ViewChild('loading') loading: IonLoading;

  isModalProfileOpen = false;
  isModalFollowingOpen = false;
  isModalFollowersOpen = false;

  token: string | null = ''
  id: string | null = ''
  header: HttpHeaders = new HttpHeaders()

  following: any[] = [];
  followers: any[] = [];
  user: any = {}

  isFollowing: boolean = false;

  constructor(    
    private http: HttpClient,
    public alertController: AlertController,
    private modalController: ModalController
  ) {
    this.mainModal = null as any
    this.loading = null as any
  }

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    this.token = token.value
    this.id = id.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${this.token}`)

    this.fetchUserData()
  }

  exitModal(){
    this.modalController.dismiss(null, 'cancel')
  }

  fetchUserData(){
    this.http.get(env.api+`users/${this.userId}`, { headers: this.header })
      .subscribe((data: any) => {
        this.user = data
        this.isFollowing = data.following
      }, async (err: any) => {
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })

      this.http.get(env.api+`users/${this.userId}/followers`, {headers: this.header})
        .subscribe((data: any) => {
          this.followers = data
        }, async (err: any) => {
          const alert = await this.createAlert('Failure', err.error.msg)
          alert.present()
        })

      this.http.get(env.api+`users/${this.userId}/followings`, {headers: this.header})
        .subscribe((data: any) => {
          this.following = data
        }, async (err: any) => {
          const alert = await this.createAlert('Failure', err.error.msg)
          alert.present()
        })
  }

  handleRefresh(event: any) {

  }

  handleFollow() {
    const body = {
      user_follower: this.id,
      user_following: this.user.user_id
    }

    this.http.post(env.api+`follows`, body, { headers: this.header })
    .subscribe(() => {
      this.isFollowing = !this.isFollowing;
    }, async (err: any) => {
      const alert = await this.createAlert('Failure', err.error.msg)
      alert.present()
    })
  }

  openModalProfile(isOpen: boolean) {
    this.isProfileOpen = isOpen
  }

  openModalFollowing(isOpen: boolean) {
    this.isModalFollowingOpen = isOpen
  }

  openModalFollowers(isOpen: boolean) {
    this.isModalFollowersOpen = isOpen
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
