import { UserService } from '../../../../../../domains/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRegister } from '../../../../../../domains/modules/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  providers: [DatePipe]
})
export class AddUserFormComponent implements OnInit {
  
  addUserForm: FormGroup = new FormGroup({});
  users: UserRegister[] = this.UserService.users;

  constructor(private UserService: UserService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm(): void {
    this.addUserForm = new FormGroup({
      userLogin: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[a-z]*')]),
      userPassword: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(6)]),
      userEnabled: new FormControl('false'),
      userFirstName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я]*')]),
      userLastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я]*')]),
      userPatronymic: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я]*')]),
      userCreateDate: new FormControl(''),
      userBirthday: new FormControl('', [Validators.required])
    });
  }



  addNewUser() {

    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }
    
    const newUser: UserRegister = {
      userId: this.users.length + 1,
      userLogin: this.addUserForm.get('userLogin')?.value,
      userPassword: this.addUserForm.get('userPassword')?.value,
      userEnabled: this.addUserForm.get('userEnabled')?.value,
      userFirstName: this.addUserForm.get('userFirstName')?.value,
      userLastName: this.addUserForm.get('userLastName')?.value,
      userPatronymic: this.addUserForm.get('userPatronymic')?.value,
      userCreateDate: this.getCurrentDateTime(),
      userBirthday: this.addUserForm.get('userBirthday')?.value,
    };
  
    this.users.push(newUser);
    this.addUserForm.reset();
  }
  
  getFieldErrors(fieldName: string) {
    const field = this.addUserForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      return field.errors;
    }
    return null;
  }
  
  getCurrentDateTime() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') as string;
  }
}