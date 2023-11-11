import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder, 
    public alertController: AlertController, 
    private router: Router,
    private http: HttpClient
  ) {

    this.loginForm = this.fb.group({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    })

  }

  async ngOnInit() {
    await this.verifyPersistence()
  }

  @ViewChild('pwInput') passwordInput: any;

  // Variables para realizar el seguimiento del estado de visibilidad del password e icon
  showPassword: boolean = false;
  eyeIcon: string = 'eye-outline';

  verifyPersistence = async () => {
    const token = await Preferences.get({ key: 'token' })
    const id = await Preferences.get({ key: 'id' })

    if (!(token.value && id.value)) 
      return 

    const headers = new HttpHeaders().append('Authorization', `Bearer ${token.value}`)

    // verifica si los datos contenidos pertencen realmente a un usuario
    this.http.get(env.api+'users/me', { headers })
      .subscribe(async (data: any) => {
        this.router.navigate(['/tab-inicial/homePrincipal'])

      }, async (err: any) => {
        await Preferences.remove({ key: 'token' })
        await Preferences.remove({ key: 'id' })
      })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordInput.type = this.showPassword ? 'text' : 'password';
    this.eyeIcon = this.showPassword ? 'eye-off' : 'eye-outline';

  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  async enterApp() {
    if (this.loginForm.invalid) {
      const alert = await this.createAlert('Empty fields', 'No field can be empty')
      await alert.present();
      return;
    }

    const form = this.loginForm.value;
    const body = {
      alias: form.username,
      password: form.password
    }

    this.http.post(env.api+'auth/login', body)
      .subscribe(async (data: any) => {
        const { token } = data

        // se obtiene el id del usuario y se guarda junto con el token en almacenamiento local
        const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`)

        this.http.get(env.api+'users/me', { headers })
          .subscribe(async (data: any) => {
            await Preferences.set({ key: "token", value: token })
            await Preferences.set({ key: 'id', value: data.user_id })
            this.router.navigate(['/tab-inicial/homePrincipal'])
    
          }, async (err: any) => {
            const alert = await this.createAlert('Failure', err.error.msg)
            alert.present()
          })

    }, async (err: any) => {
        const alert = await this.createAlert('Failure', err.error.msg)
        await alert.present();
    });
  }
}
