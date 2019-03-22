import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import * as he from 'he';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';
import { GetQuestionsError, GetQuestionsSuccess, StartQuestionsRequest } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { Question, Questions } from './questions.model';
import { QuestionsState } from './questions.reducer';
import { makeSelectQuestions } from './questions.selectors';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsEffects {
  constructor(
    private actions$: Actions,
    private questionsService: QuestionsService,
    private store: Store<QuestionsState>
  ) {}

  @Effect() getQuestions$: Observable<Action> = this.actions$.pipe(
    ofType<StartQuestionsRequest>(QuestionActionTypes.StartQuestionsRequest),
    withLatestFrom(this.store.pipe(select(makeSelectQuestions))),
    filter(questions => !!questions),
    switchMap(([action]) =>
      this.questionsService
        .getAllQuestions(action.payload.numberOfQuestions, action.payload.difficulty)
        .pipe(
          map((questions: Questions) => {
            const modified: Questions = questions.map((question: Question, i: number) => {
              const tmp = {
                ...question,
                id: i,
                answers: [
                  {
                    answer: he.decode(question.correct_answer),
                    isCorrect: true
                  }
                ].concat(
                  question.incorrect_answers.map((incorrect_answer: string) => {
                    return {
                      answer: he.decode(incorrect_answer),
                      isCorrect: false
                    };
                  })
                )
              };
              tmp.question = he.decode(tmp.question);
              delete tmp.correct_answer;
              delete tmp.incorrect_answers;
              shuffle(tmp.answers);
              return tmp;
            });
            return new GetQuestionsSuccess(modified);
          }, catchError(error => of(new GetQuestionsError(error))))
        )
    )
  );

  @Effect() selectAnswer$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActionTypes.StartSelectAnswer),
    map(res => ({ type: QuestionActionTypes.SelectAnswer, payload: res }))
  );
}
