import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { MakeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();

        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );

        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepo);
    });

    it("should be able to delete a question", async () => {
        const newQuestion = MakeQuestion(
            { authorId: new UniqueEntityID("author-1") },
            new UniqueEntityID("question-1"),
        );

        await inMemoryQuestionsRepo.create(newQuestion);

        inMemoryQuestionAttachmentsRepo.items.push(
            MakeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID("1"),
            }),

            MakeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID("2"),
            }),
        );

        await sut.execute({
            authorId: "author-1",
            questionId: "question-1",
        });

        expect(inMemoryQuestionsRepo.items).toHaveLength(0);
        expect(inMemoryQuestionAttachmentsRepo.items).toHaveLength(0);
    });

    it("should not be able to delete a question from another user", async () => {
        const newQuestion = MakeQuestion(
            { authorId: new UniqueEntityID("author-1") },
            new UniqueEntityID("question-1"),
        );

        await inMemoryQuestionsRepo.create(newQuestion);

        const result = await sut.execute({
            authorId: "author-2",
            questionId: "question-1",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
