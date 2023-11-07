import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, private router: Router) {

    this.loginForm = this.fb.group({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    })

  }

  ngOnInit() {
  }

  @ViewChild('pwInput') passwordInput: any;

  // Variables para realizar el seguimiento del estado de visibilidad del password e icon
  showPassword: boolean = false;
  eyeIcon: string = 'eye-outline';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordInput.type = this.showPassword ? 'text' : 'password';
    this.eyeIcon = this.showPassword ? 'eye-off' : 'eye-outline';

  }

  async enterApp() {
    const form = this.loginForm.value;

    //var user = JSON.parse(localStorage.getItem('user'));

    if (this.loginForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Empty fields',
        message: 'No field can be empty',
        buttons: ['Ok']
      })

      await alert.present();
      return;
    }

    if (form.username != null && form.password != null) {
      console.log('Ingresado');
      this.router.navigate(['/tab-inicial/homePrincipal'])
    } else {
      const alert = await this.alertController.create({
        header: 'Incorrect data',
        message: 'Los datos que ingresaste son incorrectos.',
        buttons: ['Ok']
      })

      await alert.present();
      return
    }
  }
}
