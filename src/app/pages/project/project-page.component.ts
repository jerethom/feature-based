import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLinkWithHref,
} from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ForModule, LetModule, PushModule } from '@rx-angular/template';
import { filter, startWith } from 'rxjs';

import { InputDirective } from '../../directives/input.directive';
import { Feature } from '../../models/feature';
import { Project } from '../../models/project';
import { FeatureService } from '../../services/feature.service';
import { ProjectService } from '../../services/project.service';

@UntilDestroy()
@Component({
  selector: 'fb-project-page',
  standalone: true,
  templateUrl: 'project-page.component.html',
  styleUrls: ['project-page.component.scss'],
  imports: [
    PushModule,
    LetModule,
    InputDirective,
    FormsModule,
    ReactiveFormsModule,
    ForModule,
    RouterLinkWithHref,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPageComponent implements OnInit {
  readonly project$ = this.projectService.project$.pipe(
    filter((project): project is Project => project !== null)
  );

  formNewFeature = new FormGroup({
    name: new FormControl(),
  });
  constructor(
    public readonly title: Title,
    public readonly activatedRoute: ActivatedRoute,
    public readonly projectService: ProjectService,
    public readonly router: Router,
    public readonly featureService: FeatureService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((event) => event instanceof NavigationEnd),
        startWith(null)
      )
      .subscribe(() =>
        this.projectService.getProject(
          this.activatedRoute.snapshot.params['id']
        )
      );

    this.projectService.project$
      .pipe(
        untilDestroyed(this),
        filter((project): project is Project => project !== null)
      )
      .subscribe((project) =>
        this.title.setTitle(`${project.name.slice(0, 20)}... | FeatureBased`)
      );
  }

  async handleNewFeature(project: Project) {
    await this.featureService.create(project, [
      this.formNewFeature.getRawValue().name,
    ]);
    this.formNewFeature.reset();
  }

  trackById(index: number, item: Feature) {
    return item.id;
  }
}
