import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { empty, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';
import { GetQuestionsError, GetQuestionsSuccess, SelectAnswer, StartQuestionsRequest } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { ApiResponse, HTMLEntity, Question, Questions } from './questions.model';
import { QuestionsState } from './questions.reducer';
import { makeSelectQuestions } from './questions.selectors';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsEffects {
  private entities: HTMLEntity = {
    '&#039;': '\'',
    '&quot;': '"',
    '&eacute;': 'é',
    '&aacute;': 'á',
    '&uacute;': 'ú',
    '&amp;': '&',
    '&divide;': '÷',
    '&times;': '×',
    '&ldquo;': '"'
  };

  constructor(private actions$: Actions, private questionsService: QuestionsService, private store: Store<QuestionsState>) { }

  @Effect() getQuestions$: Observable<Action> = this.actions$.pipe(
    ofType<StartQuestionsRequest>(QuestionActionTypes.StartQuestionsRequest),
    withLatestFrom(this.store.pipe(select(makeSelectQuestions))),
    filter((questions) => !!questions),
    switchMap(([action]) => this.questionsService.getAllQuestions(action.payload.numberOfQuestions,
      action.payload.difficulty)
      .pipe(
        map((questions: Questions) => {
          const modified: Questions = questions.map((question: Question, i: number) => {
            const tmp = {
              ...question,
              id: i,
              answers: [
                {
                  answer: question.correct_answer.replace(/&#?\w+;/g, match => this.entities[match]),
                  isCorrect: true
                }
              ].concat(
                question.incorrect_answers.map((incorrect_answer: string) => {
                  return {
                    answer: incorrect_answer.replace(/&#?\w+;/g, match => this.entities[match]),
                    isCorrect: false
                  };
                })
              )
            };
            tmp.question = tmp.question.replace(/&#?\w+;/g, match => this.entities[match]);
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
    map(res => ({ type: QuestionActionTypes.SelectAnswer, payload: res })));
}
