import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';
import { GetQuestionsError, GetQuestionsSuccess, SelectAnswer } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';
import { QuestionsService } from './questions.service';

@Injectable()
export class QuestionsEffects {
  private entities = {
    '&#039;': '\'',
    '&quot;': '"',
    '&eacute;': 'é',
    '&aacute;': 'á',
    '&uacute;': 'ú',
    '&amp;': '&'
  };

  constructor(private actions$: Actions, private questionsService: QuestionsService) { }

  @Effect() getQuestions$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActionTypes.GetQuestionsPending),
    switchMap((action: any) => this.questionsService.getAllQuestions(action.payload.numberOfQuestions, action.payload.difficulty)
      .pipe(
        map((questions: any) => {
          const modified: Questions = questions.results.map((elem, i) => {
            const tmp = {
              ...elem,
              id: i,
              answers: [
                {
                  answer: elem.correct_answer.replace(/&#?\w+;/g, match => this.entities[match]),
                  isCorrect: true
                }
              ].concat(
                elem.incorrect_answers.map(incorrect_answer => {
                  return {
                    answer: incorrect_answer.replace(/&#?\w+;/g, match => this.entities[match]),
                    isCorrect: false
                  };
                })
              )
            };
            tmp.question = tmp.question.replace(/&#?\w+;/g, match => this.entities[match]);
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
    switchMap((action: SelectAnswer) => {
      return this.questionsService
        .selectAnswer(action.payload)
        .pipe(
          map(
            res => ({ type: QuestionActionTypes.SelectAnswer, payload: res }),
            catchError(error => of(console.log(111, error)))
          )
        );
    })
  );
}
