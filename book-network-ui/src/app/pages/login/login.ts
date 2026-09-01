import { Component } from '@angular/core';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { Token } from '../../services/token/token';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { authenticate } from '../../services/fn/authentication/authenticate';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private api: Api,
    private tokenService: Token,
  ) {}

  login() {
    this.errorMsg = [];

    this.api
      .invoke(authenticate, { body: this.authRequest })
      .then((res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      })
      .catch((err) => {
        if (err.error?.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error?.error);
        }
      });
  }

  register() {
    this.router.navigate(['register']);
  }
}
