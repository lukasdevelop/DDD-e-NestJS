import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { InMemoryQuestionAttachmentsRepository } from "./../../../../../test/repositories/in-memory-question-attachments-repository";
import { MakeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();
        sut = new EditQuestionUseCase(
            inMemoryQuestionsRepo,
            inMemoryQuestionAttachmentsRepo,
        );
    });

    it("should be able to edit a question", async () => {
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
            questionId: newQuestion.id.toValue(),
            authorId: "author-1",
            title: "Pergunta teste",
            content: "Conteudo teste",
            attachmentsIds: ["1", "3"],
        });

        expect(inMemoryQuestionsRepo.items[0]).toMatchObject({
            title: "Pergunta teste",
            content: "Conteudo teste",
        });
        expect(
            inMemoryQuestionsRepo.items[0].attachments.currentItems,
        ).toHaveLength(2);
        expect(inMemoryQuestionsRepo.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
        ]);
    });

    it("should not be able to edit a question from another user", async () => {
        const newQuestion = MakeQuestion(
            { authorId: new UniqueEntityID("author-1") },
            new UniqueEntityID("question-1"),
        );

        await inMemoryQuestionsRepo.create(newQuestion);

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: "author-2",
            title: "Pergunta teste",
            content: "Conteudo teste",
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
