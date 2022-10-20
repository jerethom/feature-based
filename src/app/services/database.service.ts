import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  readonly projects!: Table<Project, string>;
  readonly features!: Table<Project, string>;
  readonly questions!: Table<Project, string>;

  constructor() {
    super('featureBased');
    this.version(1).stores({
      projects: '&id, name, *features',
      features: '&id, name, description, *presentation, *implies, *questions',
      questions: '&id, content, discussion, answer',
    });
  }
}
