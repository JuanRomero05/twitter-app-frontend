import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  isFollowing = false;

  id: string | null = ''

  @Input() user: any;

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  constructor(    
    private modalController: ModalController
  ) { }

  openModalProfile() {
    this.modalController
      .create({
        component: UserProfileComponent,
        componentProps: {
          userId: this.user.user_id
        }
      })
      .then((modal) => {
        modal.onDidDismiss()
          .then(() => {
            
          })
          modal.present()
      })
  }

  async ngOnInit() {
    const id = await Preferences.get({ key: 'id' })
    this.id = id.value    
  }

}
