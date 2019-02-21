import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Questions } from './questions.model';

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) {}

  public getAllQuestions(numberOfQuestions: number, difficulty: string) {
      const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&difficulty=${difficulty}`;
      const response = this.http.get<Questions>(url).pipe(map((questions: Questions) => questions));
      return response;
  }

  selectAnswer(dummy) {
    return dummy;
  }
}
