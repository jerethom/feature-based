import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { ForModule } from '@rx-angular/template';

import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'fb-project-list-left-panel',
  standalone: true,
  templateUrl: 'project-list-left-panel.component.html',
  styleUrls: ['project-list-left-panel.component.scss'],
  imports: [ForModule, RouterLinkWithHref, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ProjectListLeftPanelComponent {
  readonly projects$ = this.state.select('projects');

  constructor(
    public readonly projectService: ProjectService,
    public readonly state: RxState<{ projects: Project[] }>
  ) {
    this.state.connect('projects', this.projectService.getAll());
  }
}
