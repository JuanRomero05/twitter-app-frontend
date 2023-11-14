import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {

  @Input() user: any;

  id: string | null = ''

  isFollowing = false;

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  constructor() { }

  async ngOnInit() {
    const id = await Preferences.get({ key: 'id' })
    this.id = id.value    
  }

}
