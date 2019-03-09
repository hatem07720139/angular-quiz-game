import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ResetQuestions } from './questions.actions';
import { Questions } from './questions.model';
import { selectQuestionAnswer, startQuestionsRequest } from './questions.reducer';
import { makeSelectError, makeSelectPending, makeSelectQuestions } from './questions.selectors';

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

  public showErrorMessage: boolean = false;

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

  public clickedAnswer(questionID: number, buttonID: number): void {
    this.store.dispatch(selectQuestionAnswer(questionID, buttonID));
  }

  private checkForNumberOfQuestionsChange(): void {
    this.userSettings.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(_.isEqual))
      .subscribe((userSettings) => {
        if (!userSettings.numberOfQuestions) {
          this.showErrorMessage = true;
        } else {
          this.showErrorMessage = false;
          this.userSettings.get('numberOfQuestions').setValue(userSettings.numberOfQuestions, {emitEvent: false});
          this.userSettings.get('difficulty').setValue(userSettings.difficulty, {emitEvent: false});
          this.store.dispatch(new ResetQuestions);
          this.dispatchQuestionsRequest();
        }
      });
  }
}
