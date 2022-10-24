import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RxState } from '@rx-angular/state';
import { ForModule, LetModule, PushModule } from '@rx-angular/template';
import { filter, switchMap } from 'rxjs';

import { InputDirective } from '../../directives/input.directive';
import { Feature } from '../../models/feature';
import { Project } from '../../models/project';
import { Question } from '../../models/question';
import { FeatureService } from '../../services/feature.service';
import { ProjectService } from '../../services/project.service';
import { QuestionService } from '../../services/question.service';
import { TrackByService } from '../../services/track-by.service';

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
  providers: [RxState],
})
export class ProjectPageComponent {
  readonly project$ = this.state.select('project');

  readonly features$ = this.state.select('features');

  readonly questions$ = this.state.select('questions');

  formNewFeature = new FormGroup({
    name: new FormControl(),
  });

  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly projectService: ProjectService,
    public readonly questionService: QuestionService,
    public readonly featureService: FeatureService,
    public readonly title: Title,
    public readonly state: RxState<{
      project: Project;
      features: Feature[];
      questions: Question[];
    }>,
    public readonly trackBy: TrackByService
  ) {
    this.state.connect(
      'project',
      this.activatedRoute.params.pipe(
        switchMap((params) =>
          this.projectService
            .getById(params['id'])
            .pipe(filter((el): el is Project => !!el))
        )
      )
    );

    this.state.connect(
      'features',
      this.activatedRoute.params.pipe(
        switchMap((params) =>
          this.featureService.getFeaturesFromProjectById(params['id'])
        )
      )
    );

    this.state.connect(
      'questions',
      this.activatedRoute.params.pipe(
        switchMap((params) =>
          this.questionService.getQuestionsFromProjectById(params['id'])
        )
      )
    );

    this.state.hold(this.project$, (project) =>
      this.title.setTitle(`${project.name.slice(0, 20)}... | FeatureBased`)
    );
  }

  async handleNewFeature(project: Project) {
    await this.featureService.create(project, [
      this.formNewFeature.getRawValue().name,
    ]);
    this.formNewFeature.reset();
  }
}
