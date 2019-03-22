import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { QuestionActions } from './questions.actions';
import { QuestionActionTypes } from './questions.constants';
import { Answer, Question, Questions } from './questions.model';

export interface QuestionsState extends EntityState<Questions> {
  data: Questions;
  pending: boolean;
  error: string | null;
  score: number;
  maxScore: number;
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
  error: null,
  score: 0,
  maxScore: 0
});

export function startQuestionsRequest(numberOfQuestions: number, difficulty: string) {
  return {
    type: QuestionActionTypes.StartQuestionsRequest,
    payload: {
      numberOfQuestions,
      difficulty
    }
  };
}

export function selectQuestionAnswer(questionID: number, buttonID: number) {
  return {
    type: QuestionActionTypes.SelectAnswer,
    payload: {
      questionID,
      buttonID
    }
  };
}

export function questionsReducer(
  state: QuestionsState = initialState,
  action: QuestionActions
): QuestionsState {
  switch (action.type) {
    case QuestionActionTypes.StartQuestionsRequest:
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

    case QuestionActionTypes.ResetQuestions:
      return initialState;

    case QuestionActionTypes.StartSelectAnswer:
      return {
        ...state,
        pending: true,
        error: null
      };

    case QuestionActionTypes.SelectAnswer:
      return {
        ...state,
        data: state.data.map((question: Question) => {
          return question.id === action.payload.questionID
            ? {
                ...question,
                points: (() => {
                  switch (question.difficulty) {
                    case 'easy':
                      return 10;
                    case 'medium':
                      return 30;
                    case 'hard':
                      return 50;
                  }
                })(),
                answers: question.answers.map((answer: Answer, i: number) => {
                  return i === action.payload.buttonID
                    ? { ...answer, clicked: true, answered: true }
                    : { ...answer, answered: true };
                })
              }
            : question;
        })
      };

    case QuestionActionTypes.CalculateTotalScore:
      return {
        ...state,
        score: state.data
          .map((question: Question) => (question.points ? question.points : 0))
          .reduce((a: number, b: number) => a + b, 0)
      };

    case QuestionActionTypes.CalculateMaxPossibleScore:
      return {
        ...state,
        maxScore: state.data
          .map((question: Question) => (question.points ? question.points : 0))
          .reduce((a: number, b: number) => a + b, 0)
      };

    default:
      return state;
  }
}
