import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Note, NoteForm } from '../models/note.model';
import { environment } from '../../environments/environment';

interface NoteApiResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly apiUrl = `${environment.apiUrl}/notes`;
  private notesSubject = new BehaviorSubject<Note[]>([]);

  notes$ = this.notesSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadNotes(search?: string, category?: string, includeArchived: boolean = true): void {
    let params = new HttpParams()
      .set('includeArchived', String(includeArchived));

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (category && category !== 'All') {
      params = params.set('category', category);
    }

    this.http.get<NoteApiResponse[]>(this.apiUrl, { params }).subscribe({
      next: response => {
        const notes = response.map(item => this.mapFromApi(item));
        this.notesSubject.next(this.sortNotes(notes));
      },
      error: error => {
        console.error('Failed to load notes.', error);
      }
    });
  }

  getSnapshot(): Note[] {
    return this.notesSubject.value;
  }

  createNote(form: NoteForm): void {
    this.http.post<NoteApiResponse>(this.apiUrl, {
      title: form.title,
      content: form.content,
      category: form.category,
      color: form.color
    }).subscribe({
      next: response => {
        const note = this.mapFromApi(response);
        this.notesSubject.next(this.sortNotes([note, ...this.getSnapshot()]));
      },
      error: error => {
        console.error('Failed to create note.', error);
      }
    });
  }

  updateNote(id: string, form: NoteForm): void {
    this.http.put<NoteApiResponse>(`${this.apiUrl}/${id}`, {
      title: form.title,
      content: form.content,
      category: form.category,
      color: form.color
    }).subscribe({
      next: response => {
        const updatedNote = this.mapFromApi(response);
        const updatedNotes = this.getSnapshot().map(note =>
          note.id === id ? updatedNote : note
        );

        this.notesSubject.next(this.sortNotes(updatedNotes));
      },
      error: error => {
        console.error('Failed to update note.', error);
      }
    });
  }

  deleteNote(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.notesSubject.next(this.getSnapshot().filter(note => note.id !== id));
      },
      error: error => {
        console.error('Failed to delete note.', error);
      }
    });
  }

  togglePin(id: string): void {
    this.http.patch<NoteApiResponse>(`${this.apiUrl}/${id}/pin`, {}).subscribe({
      next: response => {
        const updatedNote = this.mapFromApi(response);
        const updatedNotes = this.getSnapshot().map(note =>
          note.id === id ? updatedNote : note
        );

        this.notesSubject.next(this.sortNotes(updatedNotes));
      },
      error: error => {
        console.error('Failed to pin note.', error);
      }
    });
  }

  toggleArchive(id: string): void {
    const note = this.getSnapshot().find(item => item.id === id);

    if (!note) {
      return;
    }

    const endpoint = note.archived ? 'restore' : 'archive';

    this.http.patch<NoteApiResponse>(`${this.apiUrl}/${id}/${endpoint}`, {}).subscribe({
      next: response => {
        const updatedNote = this.mapFromApi(response);
        const updatedNotes = this.getSnapshot().map(item =>
          item.id === id ? updatedNote : item
        );

        this.notesSubject.next(this.sortNotes(updatedNotes));
      },
      error: error => {
        console.error('Failed to archive/restore note.', error);
      }
    });
  }

  private mapFromApi(item: NoteApiResponse): Note {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      color: item.color,
      tags: [],
      pinned: item.isPinned,
      archived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }

  private sortNotes(notes: Note[]): Note[] {
    return [...notes].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}