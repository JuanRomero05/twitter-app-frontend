import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment as env } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

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
    public fb: FormBuilder
  ) {
    this.modalFollowing = null as any
    this.modalFollowers = null as any
    this.modalEditProfile = null as any

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

  @ViewChild('passwordInput') passwordInput: any;
  @ViewChild('repeatPasswordInput') repeatPasswordInput: any;

  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  eyeIcon: string = 'eye-outline';
  eyeIconRepeat: string = 'eye-outline';

  segment: String = 'posts';

  tweets = [];

  replies = [];

  likes = [];

  showNewTweet = false;

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })
    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    // 

    // tweets del usuario
    this.http.get(env.api + `users/${id.value}/tweets`, { headers: headers }).subscribe((data: any) => {
      this.tweets = data;
    })

    // comentarios del usuario
    this.http.get(env.api + `users/${id.value}/comments`, { headers: headers }).subscribe((data: any) => {
      this.replies = data;
    })

    // tweets con like del usuario
    this.http.get(env.api + `users/${id.value}/tweets/liked`, { headers: headers }).subscribe((data: any) => {
      this.likes = data;
    })
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
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            //TODO: Agregar logica para cerrar la sesion
            console.log('User confirm logOut');
          }
        },
        'Cancel'
      ]
    });

    return alert;
  }

  async logOut() {
    const alert = await this.createAlert('Log Out?', 'Are you sure you want to log out?')
    await alert.present();
    return;
  }

  async saveEditData() {
    console.log('giovanni es gay');
  }

}
