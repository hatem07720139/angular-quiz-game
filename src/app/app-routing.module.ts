import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './components/questions/questions.component';

const routes: Routes = [
  { path: '', redirectTo: '/questions', pathMatch: 'full' },
  // { path: '**', component: PersonalComponent },
  { path: 'questions', component: QuestionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
