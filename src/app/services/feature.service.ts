import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { liveQuery } from 'dexie';
import { switchMap } from 'rxjs';

import { Feature } from '../models/feature';
import { Project } from '../models/project';
import { wrapDixieObservable } from '../utils/wrap-dixie-observable';

import { DatabaseService } from './database.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService extends RxState<{
  projectFeatures: Feature[];
  projectFeature: Feature | null;
}> {
  readonly projectFeatures$ = this.select('projectFeatures');

  readonly projectFeature$ = this.select('projectFeature');

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly projectService: ProjectService
  ) {
    super();
    this.set({
      projectFeature: null,
      projectFeatures: [],
    });
    this.connect(
      'projectFeatures',
      this.projectService.project$.pipe(
        switchMap((project) =>
          wrapDixieObservable(
            liveQuery(() =>
              this.databaseService.features
                .filter((feature) => !!project?.features.includes(feature.id))
                .toArray()
            )
          )
        )
      )
    );
  }

  getById(id: Feature['id']) {
    this.connect(
      'projectFeature',
      wrapDixieObservable(
        liveQuery(() =>
          this.databaseService.features.get(id).then((res) => res ?? null)
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
