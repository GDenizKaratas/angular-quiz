import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerComponent } from './components/answer/answer.component';
import { QuestionComponent } from './components/question/question.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuizService } from './services/quiz.service';

const routes:Routes = [
    {
        path: '',
        component: QuizComponent
    }
]

@NgModule({
    imports:[RouterModule.forChild(routes), CommonModule],
    declarations: [QuizComponent, QuestionComponent, AnswerComponent],
    providers:[QuizService]
})
export class QuizModule {}
