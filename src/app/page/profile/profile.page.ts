import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal, AlertController, IonMenu, IonLoading } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  editProfileForm: FormGroup;

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    public fb: FormBuilder,
    private router: Router
  ) {
    this.modalFollowing = null as any
    this.modalFollowers = null as any
    this.modalEditProfile = null as any
    this.menu = null as any
    this.loading = null as any
    this.offsetTweet = 0
    this.offsetReply = 0
    this.offsetLiked = 0
    this.offsetFollower = 0
    this.offsetFollowing = 0
    this.limit = 10

    this.editProfileForm = this.fb.group({
      'firstName': new FormControl,
      'lastName': new FormControl,
      'bio': new FormControl,
      'password': new FormControl,
      'repeatPassword': new FormControl,
    }, { validator: this.pwMatchValidator })
  }

  @ViewChild(IonModal) modalFollowing: IonModal;
  @ViewChild('followersModal') modalFollowers: IonModal;
  @ViewChild('editProfileModal') modalEditProfile: IonModal;
  @ViewChild('menu') menu: IonMenu;

  @ViewChild('passwordInput') passwordInput: any;
  @ViewChild('repeatPasswordInput') repeatPasswordInput: any;

  @ViewChild('loading') loading: IonLoading;

  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  eyeIcon: string = 'eye-outline';
  eyeIconRepeat: string = 'eye-outline';

  segment: String = 'posts';

  user = {
    alias: "",
    first_name: "",
    last_name: "",
    biography: "",
    user_followings: 0,
    user_followers: 0
  }

  token: string | null = ''

  id: string | null = ''

  header: HttpHeaders = new HttpHeaders()

  following: any[] = [];

  followers: any[] = [];

  tweets: any[] = [];

  replies: any[] = [];

  likes: any[] = [];

  offsetTweet: number
  offsetReply: number
  offsetLiked: number
  offsetFollower: number
  offsetFollowing: number

  limit: number

  showNewTweet = false;

  noDataTweets = false;
  noDataReplies = false;
  noDataLikes = false;

  async ngOnInit() {
  }

  handleRefresh(event: any) {
    this.restart()
    this.fetchAllData(() => {
      event.target.complete()
    })
  }

  // cada vez que se ingresa al perfil, se recargan los datos
  async ionViewWillEnter() {
    this.restart()

    this.loading.present()

    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    this.token = token.value
    this.id = id.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${this.token}`)

    this.fetchAllData(() => {
      this.loading.dismiss(null, 'cancel')
    }) 
  }

  handleScroll(event: any) {
    if (this.segment === 'posts') {
      this.fetchTweets(()=>{
        this.offsetTweet += this.limit
        event?.target.complete()
      })
    } 

    if (this.segment === 'replies') {
      this.fetchReplies(()=>{
        this.offsetReply += this.limit
        event?.target.complete()
      })
    }

    if (this.segment === 'likes') {
      this.fetchLiked(()=>{
        this.offsetLiked += this.limit
        event?.target.complete()
      })
    }
  }

  handleFollowingScroll(event:any) {
    this.fetchFollowing(()=>{
      this.offsetFollowing += this.limit
      event?.target.complete()
    })
  }

  handleFollowerScroll(event: any){
    this.fetchFollowers(()=>{
      this.offsetFollower += this.limit
      event?.target.complete()
    })
  }

  fetchAllData(end: Function){
    this.fetchTweets(()=>{
      this.offsetTweet += this.limit
    })
    this.fetchReplies(()=>{
      this.offsetReply += this.limit
    })
    this.fetchLiked(()=>{
      this.offsetLiked += this.limit
    })
    this.fetchFollowers(()=>{
      this.offsetFollower += this.limit
    })
    this.fetchFollowing(()=>{
      this.offsetFollowing += this.limit
    })

    this.fetchUser(end)
  }

  fetchTweets(success: Function){
    this.http.get(env.api + `users/${this.id}/tweets?offset=${this.offsetTweet}&limit=${this.limit}`, { headers: this.header })
    .subscribe((data: any) => {
      this.tweets = [...this.tweets, ...data];

      if (this.tweets.length === 0) {
        this.noDataTweets = true;
      }

      success()
    }, async (err: any) => {
      this.loading.dismiss(null, 'cancel')
      const alert = await this.createAlert('Failure', err.error.msg)
      alert.present()
    })
  }

  fetchReplies(success: Function){
    this.http.get(env.api + `users/${this.id}/comments?offset=${this.offsetReply}&limit=${this.limit}`, { headers: this.header })
      .subscribe((data: any) => {
        this.replies = [...this.replies, ...data];

        if (this.replies.length === 0) {
          this.noDataReplies = true;
        }

        success()
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

  fetchLiked(success: Function){
    this.http.get(env.api + `users/${this.id}/tweets/liked?offset=${this.offsetLiked}&limit=${this.limit}`, { headers: this.header })
    .subscribe((data: any) => {
      this.likes = [...this.likes, ...data];

      if (this.likes.length === 0) {
        this.noDataLikes = true;
      }

      success()
    }, async (err: any) => {
      this.loading.dismiss(null, 'cancel')
      const alert = await this.createAlert('Failure', err.error.msg)
      alert.present()
    })
  }

  fetchFollowers(success: Function){
    this.http.get(env.api + `users/${this.id}/followers?offset=${this.offsetLiked}&limit=${this.limit}`, { headers: this.header })
      .subscribe((data: any) => {
        this.followers = [...this.followers, ...data];
        success()
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

  fetchFollowing(success: Function){
    this.http.get(env.api + `users/${this.id}/followings?offset=${this.offsetLiked}&limit=${this.limit}`, { headers: this.header })
      .subscribe((data: any) => {
        this.following = [...this.following, ...data];
        success()
      }, async (err: any) => {
        this.loading.dismiss(null, 'cancel')
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

  fetchUser(end: Function){
    this.http.get(env.api + `users/${this.id}`, { headers: this.header })
    .subscribe((data: any) => {
      this.user = data
      // actualizando datos del formulario de editar perfil
      const { first_name, last_name, biography } = data
      const { controls } = this.editProfileForm
      controls['firstName'].setValue(first_name)
      controls['lastName'].setValue(last_name)
      controls['bio'].setValue(biography)
      end()
    }, async (err: any) => {
      end()
      this.loading.dismiss(null, 'cancel')
      const alert = await this.createAlert('Failure', err.error.msg)
      alert.present()
    })
  }

  // se reinician los datos
  restart() {
    this.offsetTweet = 0
    this.offsetReply = 0
    this.offsetLiked = 0
    this.offsetFollower = 0
    this.offsetFollowing = 0
    this.noDataTweets = false;
    this.noDataReplies = false;
    this.noDataLikes = false;
    this.following = [];
    this.followers = [];
    this.tweets = [];
    this.replies = [];
    this.likes = [];
    this.user = {
      alias: "",
      first_name: "",
      last_name: "",
      biography: "",
      user_followings: 0,
      user_followers: 0
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordInput.type = this.showPassword ? 'text' : 'password';
    this.eyeIcon = this.showPassword ? 'eye-off' : 'eye-outline';

  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword;
    this.repeatPasswordInput.type = this.showRepeatPassword ? 'text' : 'password';
    this.eyeIconRepeat = this.showRepeatPassword ? 'eye-off' : 'eye-outline';
  }

  pwMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;

    if (password !== repeatPassword) {
      control.get('repeatPassword')?.setErrors({ 'passwordMismatch': true });

    } else {
      control.get('repeatPassword')?.setErrors(null);

    }
  }

  cancelModalFollowing() {
    this.modalFollowing.dismiss(null, 'cancel');
  }

  cancelModalFollowers() {
    this.modalFollowers.dismiss(null, 'cancel');
  }

  cancelEditProfile() {
    this.modalEditProfile.dismiss(null, 'cancel');
  }

  openNewTweet() {
    this.showNewTweet = true;
  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  createLogOutAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Confirm',
          handler: async () => {
            // se eliminan los datos del almacenamiento local
            await Preferences.remove({ key: 'token' })
            await Preferences.remove({ key: 'id' })

            this.restart()
            this.menu.close()

            // se redirige al login
            this.router.navigate(['/'])
          }
        },
        'Cancel'
      ]
    });

    return alert;
  }

  async logOut() {
    const alert = await this.createLogOutAlert('Log Out?', 'Are you sure you want to log out?')
    await alert.present();
    return;
  }

  async saveEditData() {
    const { controls } = this.editProfileForm

    const updatedUser: any = {
      first_name: controls['firstName'].value,
      last_name: controls['lastName'].value,
      biography: controls['bio'].value
    }

    if (controls['password'].value != controls['repeatPassword'].value){
      const alert = await this.createAlert('Failure', `Passwords don't match.`)
      alert.present()
      return
    }

    // el valor de la clave solo se tomara en cuenta si no esta vacio. De esta manera, el usuario puede elegir no editarla
    if (controls['password'].value != '')
      updatedUser.password = controls['password'].value

    this.http.put(env.api + `users/${this.id}`, updatedUser, { headers: this.header }).subscribe(async (data: any) => {
      const alert = await this.createAlert('Updated profile', 'Your profile has been successfully updated')
      alert.present()
      this.cancelEditProfile()
      this.menu.close()

    }, async (err: any) => {
      const alert = await this.createAlert('Failure', 'Error')
      alert.present()
    })
  }

}
