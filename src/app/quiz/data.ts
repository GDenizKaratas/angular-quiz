import { QuestionInterface } from "./types/question.interface"

const data: QuestionInterface[] = [
    {
        question: 'What does CSS stand for?',
        incorrectAnswers: [
            'Computer Style Sheets',
            'Creative Style Sheets',
            'Colorful Style Sheets',
        ],
        correctAnswer: 'Cascading Style Sheets',
    },

    {
        question:
        'Where in an HTML document is the correct place to refer to an external style sheet?',
        incorrectAnswers: [
            'In the <body> section',
            'At the end of the document',
            "You can't refer to an external style sheet", 
        ],
        correctAnswer: 'In the <head> section',
    },

    {
        question: 'Which HTML tas is used to define an internal style sheet?',
        incorrectAnswers: ['<script>', '<headStyle>', '<css>'],
        correctAnswer: '<style>'
    }
]


export default data
