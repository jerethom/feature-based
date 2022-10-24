import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';

import { Feature } from '../models/feature';
import { Project } from '../models/project';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAll() {
    return wrapDixieObservable(
      liveQuery(() => this.databaseService.projects.toCollection().toArray())
    );
  }

  getById(id: Project['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.projects.get(id).then((res) => res ?? null)
      )
    );
  }

  getFromFeatureById(id: Feature['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.projects
          .filter(
            (project) =>
              !!project.features.find((featureId) => featureId === id)
          )
          .toArray()
          .then((res) => res[0] ?? null)
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
