import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Questions } from './questions.model';

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) {}

  public getAllQuestions() {
    const url = 'https://opentdb.com/api.php?amount=10';
    const response = this.http.get<Questions>(url).pipe(map((questions: Questions) => questions));
    return response;
  }
}
