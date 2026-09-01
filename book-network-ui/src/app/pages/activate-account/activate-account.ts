import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Token } from '../../services/token/token';
import { FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { authenticate1 } from '../../services/fn/authentication/authenticate-1';

@Component({
  selector: 'app-activate-account',
  imports: [FormsModule, CodeInputModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.scss',
})
export class ActivateAccount {
  message: string = '';
  isOkay: boolean = true;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private api: Api,
    private token: Token,
  ) {}

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string) {
    this.api
      .invoke(authenticate1, { token })
      .then(() => {
        this.message = 'Your account has been successfully activated. Now proceed to login';
        this.submitted = true;
        this.isOkay = true;
      })
      .catch(() => {
        this.message = 'Token has expired or is invalid';
        this.submitted = true;
        this.isOkay = false;
      });
  }
}
