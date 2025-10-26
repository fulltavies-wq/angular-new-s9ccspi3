import { Component } from '@angular/core';
import { UserRegister } from '../../../../domains/modules/user.model';
import { UserService } from '../../../../domains/services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent {

  users: UserRegister[] = this.userService.users;

  constructor(private userService: UserService) {}
}