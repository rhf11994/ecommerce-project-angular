import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { Course } from '../../courses/course.model';
import { CourseService } from 'src/app/courses/services/course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseResolverGuard implements Resolve<Course> {

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Course> | Observable<never> | Course {
      const id = route.paramMap.get('id');
      return this.courseService.getCourseById(+id).pipe(
        take(1),
        mergeMap((course) => {
          if (course) {
            return of(course);
          } else {
            this.router.navigate(['/courses']);
            return EMPTY;
          }
        })
      );
  }
}
