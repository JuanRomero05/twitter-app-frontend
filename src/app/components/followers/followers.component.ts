import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {

  isFollowing = false;

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }

  constructor() { }

  ngOnInit() { }

}
