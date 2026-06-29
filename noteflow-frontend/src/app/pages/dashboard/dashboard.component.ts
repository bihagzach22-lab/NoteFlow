import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Note } from '../../models/note.model';
import { AuthService } from '../../services/auth.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  quickTitle = '';
  quickContent = '';
  private subscription?: Subscription;

  constructor(public authService: AuthService, private notesService: NotesService) { }

  ngOnInit(): void {
    this.subscription = this.notesService.notes$.subscribe(notes => {
      this.notes = notes;
    });

    this.notesService.loadNotes();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get activeNotes(): Note[] {
    return this.notes.filter(note => !note.archived);
  }

  get pinnedNotes(): Note[] {
    return this.activeNotes.filter(note => note.pinned);
  }

  get archivedNotes(): Note[] {
    return this.notes.filter(note => note.archived);
  }

  get recentNotes(): Note[] {
    return this.activeNotes.slice(0, 4);
  }

  createQuickNote(): void {
    if (!this.quickTitle.trim() && !this.quickContent.trim()) {
      return;
    }

    this.notesService.createNote({
      title: this.quickTitle,
      content: this.quickContent,
      category: 'Personal',
      color: 'yellow',
      tagsText: 'quick'
    });

    this.quickTitle = '';
    this.quickContent = '';
  }
}
