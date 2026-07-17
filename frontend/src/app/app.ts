import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideFileText, LucideMenu } from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideFileText, LucideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
