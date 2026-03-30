import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../core/data/project.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: Project[] = PROJECTS;
}
