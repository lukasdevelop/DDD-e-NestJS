import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { MakeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswersRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepo,
        );

        sut = new EditAnswerUseCase(
            inMemoryAnswersRepo,
            inMemoryAnswerAttachmentsRepo,
        );
    });

    it("should be able to edit a answer", async () => {
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
            answerId: newAnswer.id.toValue(),
            authorId: "author-1",
            content: "Conteudo teste",
            attachmentsIds: ["1", "3"],
        });

        expect(inMemoryAnswersRepo.items[0]).toMatchObject({
            content: "Conteudo teste",
        });

        expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toHaveLength(
            2,
        );
        expect(inMemoryAnswersRepo.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
        ]);
    });
});

it("should not be able to edit a answer from another user", async () => {
    const newAnswer = MakeAnswer(
        { authorId: new UniqueEntityID("author-1") },
        new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepo.create(newAnswer);

    const result = await sut.execute({
        answerId: newAnswer.id.toValue(),
        authorId: "author-2",
        content: "Conteudo teste",
        attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
});
