import { Action } from '@ngrx/store';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';

export class GetQuestionsPending implements Action {
  readonly type = QuestionActionTypes.GetQuestionsPending;
}

export class GetQuestionsSuccess implements Action {
  readonly type = QuestionActionTypes.GetQuestionsSuccess;

  constructor(public payload: Questions) {}
}

export class GetQuestionsError implements Action {
  readonly type = QuestionActionTypes.GetQuestionsError;

  constructor(public payload: { error: string }) {}
}

export class StartSelectAnswer implements Action {
  readonly type = QuestionActionTypes.StartSelectAnswer;
}

export class SelectAnswer implements Action {
  readonly type = QuestionActionTypes.SelectAnswer;

  constructor(public payload: { questionID: number; buttonID: number }) {}
}

export type QuestionActions =
  | GetQuestionsPending
  | GetQuestionsSuccess
  | GetQuestionsError
  | StartSelectAnswer
  | SelectAnswer;
