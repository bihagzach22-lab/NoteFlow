import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Note, NoteForm } from '../../models/note.model';
import { AuthService } from '../../services/auth.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  showArchived = false;
  editingNoteId: string | null = null;

  categories = ['All', 'Personal', 'Work', 'Study', 'Ideas'];
  colorOptions = ['yellow', 'blue', 'green', 'pink', 'purple'];

  form: NoteForm = this.getBlankForm();

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

  get filteredNotes(): Note[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.notes.filter(note => {
      const archiveMatches = this.showArchived ? note.archived : !note.archived;
      const categoryMatches = this.selectedCategory === 'All' || note.category === this.selectedCategory;
      const searchable = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
      const searchMatches = !search || searchable.includes(search);

      return archiveMatches && categoryMatches && searchMatches;
    });
  }

  get modeLabel(): string {
    return this.editingNoteId ? 'Update note' : 'Create note';
  }

  saveNote(): void {
    if (!this.form.title.trim() && !this.form.content.trim()) {
      return;
    }

    if (this.editingNoteId) {
      this.notesService.updateNote(this.editingNoteId, this.form);
    } else {
      this.notesService.createNote(this.form);
    }

    this.resetForm();
  }

  editNote(note: Note): void {
    this.editingNoteId = note.id;
    this.form = {
      title: note.title,
      content: note.content,
      category: note.category,
      color: note.color,
      tagsText: note.tags.join(', ')
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteNote(note: Note): void {
    const confirmed = window.confirm(`Delete "${note.title}"?`);
    if (confirmed) {
      this.notesService.deleteNote(note.id);
    }
  }

  togglePin(note: Note): void {
    this.notesService.togglePin(note.id);
  }

  toggleArchive(note: Note): void {
    this.notesService.toggleArchive(note.id);
  }

  resetForm(): void {
    this.editingNoteId = null;
    this.form = this.getBlankForm();
  }

  trackByNote(index: number, note: Note): string {
    return note.id;
  }

  private getBlankForm(): NoteForm {
    return {
      title: '',
      content: '',
      category: 'Personal',
      color: 'yellow',
      tagsText: ''
    };
  }
}
