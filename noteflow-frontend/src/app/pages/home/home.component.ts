import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  features = [
    {
      icon: '✍️',
      title: 'Write fast',
      text: 'Capture lecture notes, meeting ideas, reminders, and drafts without friction.'
    },
    {
      icon: '🏷️',
      title: 'Organize clearly',
      text: 'Group notes by category, tags, pinned status, and archive state.'
    },
    {
      icon: '🔎',
      title: 'Find anything',
      text: 'Search titles, note content, and tags from one clean workspace.'
    },
    {
      icon: '🔐',
      title: 'Secure workspace',
      text: 'Protect your personal note space with login, route guards, and API-ready authentication.'
    }
  ];

  steps = [
    'Create a note',
    'Add tags and category',
    'Pin what matters',
    'Search when needed'
  ];

  constructor(public authService: AuthService) { }

  ngAfterViewInit(): void {
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initScrollReveal(): void {
    const elements = document.querySelectorAll('.reveal-on-scroll');

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // Stop observing after first animation to prevent flickering.
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(element => this.observer?.observe(element));
  }
}