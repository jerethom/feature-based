import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { liveQuery } from 'dexie';

import { Project } from '../models/project';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends RxState<{ projects: Project[] }> {
  readonly list$ = this.select('projects');

  constructor(private readonly databaseService: DatabaseService) {
    super();
    this.set({ projects: [] });
    this.connect(
      'projects',
      wrapDixieObservable(
        liveQuery(() => this.databaseService.projects.toArray())
      )
    );
  }

  async create(args: ConstructorParameters<typeof Project>): Promise<Project> {
    const project = new Project(...args);
    await this.databaseService.projects.add(project);
    return project;
  }

  async delete(id: Project['id']): Promise<void> {
    await this.databaseService.projects.delete(id);
  }
}
