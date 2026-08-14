from aiogram.fsm.state import State, StatesGroup


class LessonState(StatesGroup):
    lesson_id = State()
    section_index = State()
    question_index = State()


class CardState(StatesGroup):
    index = State()


class QuizState(StatesGroup):
    quiz_id = State()
    question_index = State()
    score = State()
