import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { ActionSheetController, AlertController, IonModal } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';


@Component({
  selector: 'app-new-tweet',
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.scss'],
})
export class NewTweetComponent implements OnInit {

  @Input() modalTrigger: any

  newTweetForm: FormGroup;
  token: string | null = ''
  id: string | null = ''
  header: HttpHeaders = new HttpHeaders()

  constructor(
    public fb: FormBuilder,
    private actionSheetController: ActionSheetController,
    private http: HttpClient,
    private alertController: AlertController
  ) {
    this.modal = null as any
    this.newTweetForm = this.fb.group({
      'newTweet': new FormControl("", Validators.required),
    });

  }

  @ViewChild(IonModal) modal: IonModal;

  async ngOnInit() { 
    const token = await Preferences.get({ key: "token" })
    const id = await Preferences.get({ key: "id" })

    this.token = token.value
    this.id = id.value
    this.header = new HttpHeaders().append('Authorization', `Bearer ${this.token}`)
  }

  createAlert = async (header: string, message: string) => {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok']
    });

    return alert
  }

  createTweet(){
    const input = this.newTweetForm.controls['newTweet'].value

    const body = {
      tweet_content: input,
      user_id: this.id
    }

    this.http.post(env.api+'tweets', body, { headers: this.header })
      .subscribe(async () => {
        const alert = await this.createAlert('Post created', 'Your tweet has been published.')
        alert.present()
        // salirse del modal
        this.newTweetForm.controls['newTweet'].setValue('')
        this.modal.dismiss(null, 'cancel')
      }, async (err: any) => {
        const alert = await this.createAlert('Failure', err.error.msg)
        alert.present()
      })
  }

  gallery(){
    console.log('a')
  }

  async setOpen(value: boolean) {
    if (value) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Close?',
        subHeader: 'Are you sure you want to lose the saved data?',
        buttons: [
          {
            text: 'Confirm',
            handler: () => {
              this.newTweetForm.controls['newTweet'].setValue('')
              this.modal.dismiss(null, 'cancel')
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    } 
  }
}
