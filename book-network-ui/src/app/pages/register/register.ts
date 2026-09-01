import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

import { RegistrationRequest } from '../../services/models/registration-request';
import { FormsModule } from '@angular/forms';
import {register} from '../../services/fn/authentication/register';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registrationRequest: RegistrationRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private api: Api,
  ) {}

  register() {
    this.errorMsg = [];

    this.api
      .invoke(register, { body: this.registrationRequest })
      .then(() => {
        this.router.navigate(['activate-account']);
      })
      .catch((err) => {
        if (err.error?.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error?.error);
        }
      });
  }

  login() {
    this.router.navigate(['login']);
  }
}
