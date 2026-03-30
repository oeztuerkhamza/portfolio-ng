import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../core/data/project.data';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  project = signal<Project | null>(null);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = PROJECTS.find((p) => p.slug === slug);
    this.project.set(found ?? null);
  }

  goBack() {
    this.location.back();
  }
}
