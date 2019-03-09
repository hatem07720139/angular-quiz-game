import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CalculateTotalScore, ResetQuestions } from './questions.actions';
import { Answer, Questions } from './questions.model';
import { selectQuestionAnswer, startQuestionsRequest } from './questions.reducer';
import { makeAnswerFeedback, makeSelectError, makeSelectPending, makeSelectQuestions, makeSelectTotalScore } from './questions.selectors';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public questions$: Observable<Questions>;
  public isLoading$: Observable<boolean>;
  public isError$: Observable<string>;

  public userSettings: FormGroup = new FormGroup({
    numberOfQuestions: new FormControl(10, [Validators.required, Validators.min(1)]),
    difficulty: new FormControl('select a difficulty')
  });

  public showNoQuestionsErrorMessage: boolean = false;
  public showAnswerFeedbackMessage: string[] = [];

  constructor(private store: Store<{ questions: Questions }>) { }

  public ngOnInit(): void {
    this.dispatchQuestionsRequest();
    this.checkForNumberOfQuestionsChange();
  }

  private dispatchQuestionsRequest(): void {
    this.store.dispatch(startQuestionsRequest(
      this.userSettings.get('numberOfQuestions').value,
      this.userSettings.get('difficulty').value)
    );
    this.questions$ = this.store.pipe(select(makeSelectQuestions));
    this.isLoading$ = this.store.pipe(select(makeSelectPending));
    this.isError$ = this.store.pipe(select(makeSelectError));
  }

  public selectedAnswer(questionID: number, buttonID: number): void {
    this.store.dispatch(selectQuestionAnswer(questionID, buttonID));

    const correctAnswerMessages: string[] = [
      'Correct answer!',
      `Wow, you're smart ;)`,
      'Come on, you must be cheating!',
      'How did you know?!'
    ];

    const wrongAnswerMessages: string[] = [
      'ohh too bad!',
      `Try again next time :P`,
      'WRONG!',
      'You stupid or what?!'
    ];

    this.store.pipe(select(makeAnswerFeedback(questionID))).subscribe(
      (correctAnswer: Answer[]) => {
        const isCorrect = correctAnswer.find((answer: Answer) => answer.isCorrect === answer.clicked);

        this.showAnswerFeedbackMessage[questionID] = isCorrect
          ? correctAnswerMessages[Math.floor(Math.random() * correctAnswerMessages.length)]
          : wrongAnswerMessages[Math.floor(Math.random() * wrongAnswerMessages.length)];
      }
    );

    this.store.dispatch(new CalculateTotalScore);
  }

  private checkForNumberOfQuestionsChange(): void {
    this.userSettings.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(_.isEqual))
      .subscribe((userSettings) => {
        if (!userSettings.numberOfQuestions) {
          this.showNoQuestionsErrorMessage = true;
        } else {
          this.showNoQuestionsErrorMessage = false;
          this.userSettings.get('numberOfQuestions').setValue(userSettings.numberOfQuestions, { emitEvent: false });
          this.userSettings.get('difficulty').setValue(userSettings.difficulty, { emitEvent: false });
          this.store.dispatch(new ResetQuestions);
          this.dispatchQuestionsRequest();
        }
      });
  }
}
