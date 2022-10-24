import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Feature } from '../models/feature';
import { Project } from '../models/project';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  readonly projects!: Table<Project, string>;
  readonly features!: Table<Feature, string>;
  readonly questions!: Table<Question, string>;

  constructor() {
    super('featureBased');
    this.version(1).stores({
      projects: Project.schema,
      features: Feature.schema,
      questions: Question.schema,
    });
  }
}
