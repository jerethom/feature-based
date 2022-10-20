import { Component } from '@angular/core';
import { ForModule } from '@rx-angular/template';

import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'fb-project-list-left-panel',
  standalone: true,
  templateUrl: 'project-list-left-panel.component.html',
  styleUrls: ['project-list-left-panel.component.scss'],
  imports: [ForModule],
})
export class ProjectListLeftPanelComponent {
  constructor(public readonly projectService: ProjectService) {}
}
