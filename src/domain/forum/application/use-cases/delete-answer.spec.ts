import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { MakeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepo,
        );
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepo);
    });

    it("should be able to delete a answer", async () => {
        const newAnswer = MakeAnswer(
            { authorId: new UniqueEntityID("author-1") },
            new UniqueEntityID("answer-1"),
        );

        await inMemoryAnswersRepo.create(newAnswer);

        inMemoryAnswerAttachmentsRepo.items.push(
            MakeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID("1"),
            }),

            MakeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID("2"),
            }),
        );

        await sut.execute({
            authorId: "author-1",
            answerId: "answer-1",
        });

        expect(inMemoryAnswersRepo.items).toHaveLength(0);
        expect(inMemoryAnswerAttachmentsRepo.items).toHaveLength(0);
    });

    it("should not be able to delete a answer from another user", async () => {
        const newAnswer = MakeAnswer(
            { authorId: new UniqueEntityID("author-1") },
            new UniqueEntityID("answer-1"),
        );

        await inMemoryAnswersRepo.create(newAnswer);

        const result = await sut.execute({
            answerId: "answer-1",
            authorId: "author-2",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
