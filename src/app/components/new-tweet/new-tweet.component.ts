import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-new-tweet',
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.scss'],
})
export class NewTweetComponent implements OnInit {

  newTweetForm: FormGroup;
  isModalOpen: boolean;

  constructor(
    public fb: FormBuilder,
    private actionSheetController: ActionSheetController
  ) {

    this.isModalOpen = true;
    this.newTweetForm = this.fb.group({
      'newTweet': new FormControl("", Validators.required),
    });

  }

  ngOnInit() { }

  async setOpen(value: boolean) {
    if (value) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Close?',
        subHeader: 'Are you sure you want to lose the saved data?',
        buttons: [
          {
            text: 'Confirm',
            handler: () => {
              this.isModalOpen = false;
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    } else {
      this.isModalOpen = false;
    }
  }
}
