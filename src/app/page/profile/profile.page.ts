import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment as env } from 'src/environments/environment';
import { GetResult, Preferences } from '@capacitor/preferences';
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
  
  user = {
    alias: "",
    first_name: "",
    last_name: "",
    biography: "",
    user_followings: 0,
    user_followers: 0
  }

  tweets = [];

  replies = [];

  likes = [];

  showNewTweet = false;

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })
    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    // datos del usuario
    this.http.get(env.api+`users/${id.value}`, { headers: headers }).subscribe((data: any) => {
      this.user = data

      // actualizando datos del formulario de editar perfil
      const { first_name, last_name, biography } = data
      const { controls } = this.editProfileForm
      
      controls['firstName'].setValue(first_name)
      controls['lastName'].setValue(last_name)
      controls['bio'].setValue(biography)
    })

    // tweets del usuario
    this.http.get(env.api+`users/${id.value}/tweets`, { headers: headers }).subscribe((data: any) => {
      this.tweets = data;
    })

    // comentarios del usuario
    this.http.get(env.api+`users/${id.value}/comments`, { headers: headers }).subscribe((data: any) => {
      this.replies = data;
    })

    // tweets con like del usuario
    this.http.get(env.api+`users/${id.value}/tweets/liked`, { headers: headers }).subscribe((data: any) => {
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
    
    if (controls['password'].value != '') 
      updatedUser.password = controls['password']


    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    this.http.put(env.api+`users/${id.value}`, updatedUser, { headers: headers }).subscribe((data: any) => {
      this.router.navigate(['/tab-inicial-profile'])
      // refrescar
    }, async (err: any) => {
      const alert = await this.createAlert('Failure', err.error.msg)
      alert.present()
    })
  }

}
