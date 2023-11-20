import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { MakeQuestion } from "test/factories/make-question";

let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );

        inMemoryQuestionCommentsRepo = new InMemoryQuestionCommentsRepository();

        sut = new CommentOnQuestionUseCase(
            inMemoryQuestionsRepo,
            inMemoryQuestionCommentsRepo,
        );
    });

    it("should be able to comment on question", async () => {
        const question = MakeQuestion();

        await inMemoryQuestionsRepo.create(question);

        await sut.execute({
            authorId: question.authorId.toString(),
            questionId: question.id.toString(),
            content: "Comentario teste",
        });

        expect(inMemoryQuestionCommentsRepo.items[0].content).toEqual(
            "Comentario teste",
        );
    });

    it("should not be able to delete another user question comment", async () => {
        const question = MakeQuestion({
            authorId: new UniqueEntityID("author-1"),
        });

        await inMemoryQuestionsRepo.create(question);

        const result = await sut.execute({
            authorId: "author-2",
            questionId: question.id.toString(),
            content: "teste",
        });

        expect(result.isLeft()).toBe(false);
    });
});
