import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from './questions.model';

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) { }

  public getAllQuestions(numberOfQuestions: number, difficulty: string) {
    const modifyDifficulty = difficulty === 'select a difficulty'
      ? ''
      : difficulty;
    const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&difficulty=${modifyDifficulty}`;
    return this.http.get<ApiResponse>(url).pipe(map((response: ApiResponse) => response.results));
  }

  selectAnswer(dummy) {
    return dummy;
  }
}
