export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteForm {
  title: string;
  content: string;
  category: string;
  color: string;
  tagsText: string;
}
