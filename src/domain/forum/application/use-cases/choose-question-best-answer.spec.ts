import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { MakeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentsRepository();
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        inMemoryAnswersRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepo,
        );

        sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryQuestionsRepo,
            inMemoryAnswersRepo,
        );
    });

    it("should be able to choose the question best answer", async () => {
        const question = MakeQuestion();

        const answer = MakeAnswer({
            questionId: question.id,
        });

        await inMemoryQuestionsRepo.create(question);
        await inMemoryAnswersRepo.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        });

        expect(inMemoryQuestionsRepo.items[0].bestAnswerId).toEqual(answer.id);
    });

    it("should not be able to choose another user question best answer ", async () => {
        const question = MakeQuestion({
            authorId: new UniqueEntityID("author-1"),
        });

        const answer = MakeAnswer({
            questionId: question.id,
        });

        await inMemoryQuestionsRepo.create(question);
        await inMemoryAnswersRepo.create(answer);

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: "author-2",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
