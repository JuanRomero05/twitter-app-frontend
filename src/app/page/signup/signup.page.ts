import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController) {

    this.signupForm = this.fb.group({
      'username': new FormControl("", Validators.required),
      'firstName': new FormControl("", Validators.required),
      'lastName': new FormControl("", Validators.required),
      'bio': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'repeatPassword': new FormControl("", Validators.required),
    });

  }

  ngOnInit() {
  }

  async saveData() {
    var form = this.signupForm.value;

    if (this.signupForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Empty fields',
        message: 'No field can be empty',
        buttons: ['Ok']
      })

      await alert.present();
      return;
    } //TODO: agregar validacion para que me redirija a login
    const user = {
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      password: form.password,
    }

    localStorage.setItem('user', JSON.stringify(user));
  }

}
