import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

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

  constructor() { }

  async ngOnInit() {
    const id = await Preferences.get({ key: 'id' })
    this.id = id.value    
  }

}
