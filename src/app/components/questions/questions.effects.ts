import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
        map((questions: Questions) => new GetQuestionsSuccess(questions)),
        catchError(error => of(new GetQuestionsError(error)))
      )
    )
  );
}
