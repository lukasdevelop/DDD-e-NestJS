import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepo: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
        inMemoryAnswerRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        );
        sut = new AnswerQuestionUseCase(inMemoryAnswerRepo);
    });

    it("create a question", async () => {
        const result = await sut.execute({
            questionId: "1",
            instructorId: "1",
            content: "Conteúdo da resposta",
            attachmentsIds: ["1", "2"],
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryAnswerRepo.items[0]).toEqual(result.value?.answer);
        expect(inMemoryAnswerRepo.items[0].attachments.currentItems).toHaveLength(
            2,
        );
        expect(inMemoryAnswerRepo.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
        ]);
    });
});
