import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideFileText, LucideMenu, LucideLogIn, LucideLogOut } from '@lucide/angular';
import { Modal } from './components/modal/modal';
import { AuthService } from './services/auth.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, LucideFileText, LucideMenu, LucideLogIn, LucideLogOut, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  auth = inject(AuthService);
  i18n = inject(I18nService);
  protected t = this.i18n.t;

  showLoginModal = signal(false);
  loginError = signal(false);
  creds = { username: '', password: '' };

  constructor() {
    effect(() => { document.documentElement.lang = this.i18n.lang(); });
  }

  openLogin() {
    this.loginError.set(false);
    this.creds = { username: '', password: '' };
    this.showLoginModal.set(true);
  }

  closeLogin() { this.showLoginModal.set(false); }

  login() {
    this.auth.login(this.creds.username, this.creds.password).subscribe({
      next: () => this.closeLogin(),
      error: () => this.loginError.set(true),
    });
  }

  logout() { this.auth.logout(); }
}
