import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IonModal, AlertController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  token: string | null = ''

  id: string | null = ''

  header: HttpHeaders = new HttpHeaders()

  following = [];

  followers = [];

  tweets = [];

  replies = [];

  likes = [];

  showNewTweet = false;

  async ngOnInit() {
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    this.token = token.value
    this.id = id.value
    this.header =  new HttpHeaders().append('Authorization', `Bearer ${this.token}`)

    this.fetchProfileData(()=>{})
  }

  handleRefresh(event: any) {
    this.fetchProfileData(()=>{
      event.target.complete()
    })  
  }

// end es el codigo que se ejecuta una vez se hayan obtenido todos los datos del perfil
fetchProfileData(end: Function){
    // tweets del usuario
    this.http.get(env.api + `users/${this.id}/tweets`, { headers: this.header })
      .subscribe((data: any) => {
      this.tweets = data;
    })

    // comentarios del usuario
    this.http.get(env.api + `users/${this.id}/comments`, { headers: this.header })
      .subscribe((data: any) => {
      this.replies = data;
    })

    // tweets con like del usuario
    this.http.get(env.api + `users/${this.id}/tweets/liked`, { headers: this.header })
      .subscribe((data: any) => {
      this.likes = data;
    })

    // seguidores
    this.http.get(env.api+`users/${this.id}/followers`, { headers: this.header })
      .subscribe((data:any) => {
      this.followers = data;
  })

    // seguidos
    this.http.get(env.api+`users/${this.id}/followings`, { headers: this.header })
    . subscribe((data:any) => {
      this.following = data;
      end();
    })

    // datos del usuario
    this.http.get(env.api+`users/${this.id}`, { headers: this.header })
      .subscribe((data: any) => {
      this.user = data

      // actualizando datos del formulario de editar perfil
      const { first_name, last_name, biography } = data
      const { controls } = this.editProfileForm
      
      controls['firstName'].setValue(first_name)
      controls['lastName'].setValue(last_name)
      controls['bio'].setValue(biography)

      end()
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
      updatedUser.password = controls['password'].value

    this.http.put(env.api+`users/${this.id}`, updatedUser, { headers: this.header }).subscribe(async (data: any) => {
      const alert = await this.createAlert('Updated profile', 'Your profile has been successfully updated')
      alert.present()
      // refrescar
    }, async (err: any) => {
      const alert = await this.createAlert('Failure', 'Error')
      alert.present()
    })
  }

}
