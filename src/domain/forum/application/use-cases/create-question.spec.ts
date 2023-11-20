import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepo);
    });

    it("create a question", async () => {
        const result = await sut.execute({
            authorId: "1",
            title: "Nova pergunta",
            content: "Conteúdo da pergunta",
            attachmentsIds: ["1", "2"],
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryQuestionsRepo.items[0]).toEqual(result.value?.question);
        expect(
            inMemoryQuestionsRepo.items[0].attachments.currentItems,
        ).toHaveLength(2);
        expect(inMemoryQuestionsRepo.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
        ]);
    });
});
