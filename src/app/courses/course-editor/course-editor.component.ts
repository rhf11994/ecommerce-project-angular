import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from '../course.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CanComponentDeactivate } from 'src/app/core/guards/can-deactivate.guard';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseEditorComponent implements OnInit, CanComponentDeactivate {
  public newCoursee: Course;
  public editedCourse: Course;
  public isSaved: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.editedCourse = null;
    this.isSaved = false;
    this.newCoursee = new Course(this.generateCourseId());
    this.route.data.subscribe(
      ({course}) => {
        if (course) {
          this.editedCourse = course;
          this.newCoursee = { ...course };
        }
    });
  }

  public get authors(): string {
    return this.newCoursee.authors
      .map(({firstName, lastName}) => lastName ?
        `${firstName} ${lastName}` :
        firstName)
      .join(', ');
  }

  public set authors(value: string) {
    this.newCoursee.authors = value.split(',')
      .map((author: string) => {
        const [firstName = '', lastName = ''] = author.trim().split(' ').map((item) => item && item.trim());

        return {
          id: Math.floor(Math.random() * Date.now()),
          firstName,
          lastName
        };
      });
  }

  public saveCourse(): void {
    console.log('Changes saved successfully.');
    console.log(this.newCoursee);
    this.editedCourse ?
      this.courseService.updateCourse(this.editedCourse, this.newCoursee) :
      this.courseService.createCourse(this.newCoursee);

    this.isSaved = true;

    this.router.navigate(['/courses']);
  }

  public returnToCourses(): void {
    this.router.navigate(['/courses']);
  }

  public setNewDate(newDate: string): void {
    console.log(newDate);
    this.newCoursee.date = newDate;
  }

  public setDuration(newDuration: number): void {
    console.log(newDuration);
    this.newCoursee.duration = newDuration;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const unsavedChanges = !this.isSaved &&
      this.editedCourse &&
      Object.keys(this.editedCourse).some((key: string) => {
        return this.editedCourse[key] !== this.newCoursee[key];
    });

    return unsavedChanges ?
      confirm('Do you want to discard the changes?') :
      true;
  }

  private generateCourseId(): number {
    return Math.trunc(Math.random() * Date.now());
  }
}
