import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { ActionSheetController, AlertController, IonModal } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from 'src/firebase/config'
import { v4 } from 'uuid'

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
  imageData: string | undefined;
  imageFormat: string | undefined
  imageDataString: string | undefined;
  imageUrl: string | undefined

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
    this.imageData = ''
    this.imageFormat = ''
    this.imageUrl = ''
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

  createTweet() {
    this.uploadImage()
    const input = this.newTweetForm.controls['newTweet'].value

    const body: any = {
      tweet_content: input,
      user_id: this.id
    } 

    if (this.imageUrl) 
      body.image_url = this.imageUrl

    console.log(body.image_url)

    this.http.post(env.api + 'tweets', body, { headers: this.header })
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

  async uploadImage() {
    if (!this.imageData) 
      return

    const storageRef = ref(storage, `twitter-posts/${v4()}.${this.imageFormat}`)

    await uploadString(storageRef, <string> this.imageData, 'data_url')

    const url = await getDownloadURL(storageRef)
    
    this.imageUrl = url
  }

  async gallery() {
    Camera.requestPermissions();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    //Validando que la imagen exista
    if (image) {
      this.imageData = image.dataUrl;
      this.imageFormat = image.format
    }

  }

  deletePhoto() {
    this.imageData = undefined;
  }

  /* async savePhoto(photo: string) {
    await Filesystem.writeFile({
      path: 'test.jpg',
      data: photo,
      directory: Directory.Documents,
    });
  } */

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
