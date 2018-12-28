import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { QuestionActions } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { Questions } from './questions.model';

export interface QuestionsState extends EntityState<Questions> {
  data: Questions;
  pending: boolean;
  error: string | null;
}

export function selectAnswer(data: Questions): string {
  return data[0].category;
}

export const questionsAdapter: EntityAdapter<Questions> = createEntityAdapter<Questions>({
  selectId: selectAnswer
});

export const initialState: QuestionsState = questionsAdapter.getInitialState({
  data: [],
  pending: false,
  error: null
});

export function startQuestionsRequest() {
  return {
    type: QuestionActionTypes.GetQuestionsPending
  };
}

export function questionsReducer(
  state: QuestionsState = initialState,
  action: QuestionActions
): QuestionsState {
  switch (action.type) {
    case QuestionActionTypes.GetQuestionsPending:
      return {
        ...state,
        pending: true,
        error: null
      };
    case QuestionActionTypes.GetQuestionsSuccess:
      return {
        ...state,
        pending: false,
        data: action.payload
      };
    // TODO: use properly, find a way to set pending to false
    // return questionsAdapter.addOne(action.payload, state);
    case QuestionActionTypes.GetQuestionsError:
      return {
        ...state,
        pending: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
