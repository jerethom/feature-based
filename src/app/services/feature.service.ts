import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { Observable } from 'rxjs';

import { Feature } from '../models/feature';
import { Project } from '../models/project';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly projectService: ProjectService
  ) {}

  getFeature(id: Feature['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.features.get(id).then((res) => res ?? null)
      )
    );
  }

  getOtherFeatures(id: Feature['id']): Observable<Feature[]> {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.projects
          .filter((project) => project.features.includes(id))
          .toArray()
          .then((res) => res[0])
          .then((project) =>
            this.databaseService.features
              .bulkGet(project?.features ?? [])
              .then((features) =>
                features.filter(
                  (feature): feature is Feature =>
                    !!feature && feature?.id !== id
                )
              )
          )
          .then((res) => res.flat(1))
      )
    );
  }

  getFeaturesFromProjectById(id: Project['id']) {
    return wrapDixieObservable(
      liveQuery(() =>
        this.databaseService.projects
          .get(id)
          .then((project) =>
            this.databaseService.features
              .bulkGet(project?.features ?? [])
              .then((res) => res.filter((el): el is Feature => !!el))
          )
      )
    );
  }

  async create(
    project: Project,
    args: ConstructorParameters<typeof Feature>
  ): Promise<Feature> {
    const feature = new Feature(...args);
    await this.databaseService.features.add(feature);
    await this.projectService.update(project.id, {
      features: [...project.features, feature.id],
    });
    return feature;
  }

  async delete(id: Feature['id']): Promise<void> {
    await this.databaseService.features.delete(id);
  }

  async update(id: Feature['id'], args: Partial<Feature>) {
    await this.databaseService.features.update(id, args);
  }
}
