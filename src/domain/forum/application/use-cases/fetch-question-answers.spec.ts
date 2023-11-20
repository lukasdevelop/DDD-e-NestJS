import { MakeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepo,
        );
        sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepo);
    });

    it("should be able to fetch question answers", async () => {
        await inMemoryAnswersRepo.create(
            MakeAnswer({
                questionId: new UniqueEntityID("question-1"),
            }),
        );

        await inMemoryAnswersRepo.create(
            MakeAnswer({
                questionId: new UniqueEntityID("question-1"),
            }),
        );

        await inMemoryAnswersRepo.create(
            MakeAnswer({
                questionId: new UniqueEntityID("question-1"),
            }),
        );

        const result = await sut.execute({
            questionId: "question-1",
            page: 1,
        });

        expect(result.value?.answers).toHaveLength(3);
    });
});

it("should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
        await inMemoryAnswersRepo.create(
            MakeAnswer({
                questionId: new UniqueEntityID("question-1"),
            }),
        );
    }

    const result = await sut.execute({
        questionId: "question-1",
        page: 2,
    });

    expect(result.value?.answers).toHaveLength(5);
});
