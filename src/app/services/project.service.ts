import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { liveQuery } from 'dexie';

import { Project } from '../models/project';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends RxState<{
  projects: Project[];
  project: Project | null;
}> {
  readonly list$ = this.select('projects');

  readonly project$ = this.select('project');

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

  async getProject(id: Project['id']) {
    this.connect(
      'project',
      wrapDixieObservable(
        liveQuery(() =>
          this.databaseService.projects.get(id).then((res) => res ?? null)
        )
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

  async update(id: Project['id'], args: Partial<Project>) {
    await this.databaseService.projects.update(id, args);
  }
}
