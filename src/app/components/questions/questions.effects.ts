import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';
import { GetQuestionsError, GetQuestionsSuccess } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsEffects {
  constructor(private actions$: Actions, private questionsService: QuestionsService) {}

  @Effect() getQuestions$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActionTypes.GetQuestionsPending),
    switchMap(() =>
      this.questionsService.getAllQuestions().pipe(
        map((questions: any) => {
          const modified: Questions = questions.results.map(elem => {
            const tmp = {
              ...elem,
              answers: [{ answer: elem.correct_answer, isCorrect: true }].concat(
                elem.incorrect_answers.map(incorrect_answer => {
                  return { answer: incorrect_answer, isCorrect: false };
                })
              )
            };
            shuffle(tmp.answers);
            return tmp;
          });
          return new GetQuestionsSuccess(modified);
        }, catchError(error => of(new GetQuestionsError(error))))
      )
    )
  );
}
