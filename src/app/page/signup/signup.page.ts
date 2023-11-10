import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {

  signupForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    private http: HttpClient
  ) {

    this.signupForm = this.fb.group({
      'username': new FormControl("", Validators.required),
      'firstName': new FormControl("", Validators.required),
      'lastName': new FormControl("", Validators.required),
      'bio': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'repeatPassword': new FormControl("", Validators.required),
    }, { validator: this.pwMatchValidator });

  }

  ngOnInit() {
  }

  // Referencias a los elementos password y repeatPassword
  @ViewChild('passwordInput') passwordInput: any;
  @ViewChild('repeatPasswordInput') repeatPasswordInput: any;

  // Variables para realizar el seguimiento del estado de visibilidad del password e icon
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  eyeIcon: string = 'eye-outline';
  eyeIconRepeat: string = 'eye-outline';

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

  async saveData() {
    if (this.signupForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Empty fields',
        message: 'No field can be empty',
        buttons: ['Ok']
      })

      await alert.present();
      return;
    } 

    //TODO: Guardar los datos en el back
    const form = this.signupForm.value;

    const url = 'https://twitter-api-awdc.onrender.com/api/auth/signup'
    
    const headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json')

    const body = {
      alias: form.username,
      first_name: form.firstName,
      last_name: form.lastName,
      password: form.password,
      biography: form.bio
    }

    this.http.post(url, body, { headers })
      .subscribe((data: any) => {
        console.log(data)
    }, (error: any) => {
      console.log(error)
    }, () => {
      console.log('Final.')
    })

    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your data has been saved successfully',
      buttons: ['Ok']
    })

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.router.navigate(['login']);
    });
  }
}
