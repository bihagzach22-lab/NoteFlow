import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Note } from '../../models/note.model';
import { AppUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  users: Omit<AppUser, 'password'>[] = [];
  notes: Note[] = [];
  private subscription?: Subscription;

  constructor(public authService: AuthService, private notesService: NotesService) { }

  ngOnInit(): void {
    this.users = this.authService.getUsersForAdmin();
    this.subscription = this.notesService.notes$.subscribe(notes => {
      this.notes = notes;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get activeNotes(): number {
    return this.notes.filter(note => !note.archived).length;
  }
}
