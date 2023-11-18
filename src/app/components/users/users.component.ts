import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  isFollowing: boolean;

  id: string | null = ''

  @Input() user: any;

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  constructor(    
    private router: Router,
    private modalController: ModalController
  ) {
    this.isFollowing = false
  }

  openModalProfile() {
    // si se trata del perfil del mismo usuario
    if (this.user.user_id == this.id){
      this.router.navigate(['/tab-inicial/profile']);
      return
    }

    this.modalController
      .create({
        component: UserProfileComponent,
        componentProps: {
          userId: this.user.user_id
        }
      })
      .then((modal) => {
        modal.present()
      })
  }

  async ngOnInit() {
    const id = await Preferences.get({ key: 'id' })
    this.id = id.value    
  }
}
