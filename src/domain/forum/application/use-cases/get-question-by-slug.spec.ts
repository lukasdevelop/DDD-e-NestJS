import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { MakeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepo);
    });

    it("should be able to get a question by slug", async () => {
        const newQuestion = MakeQuestion({
            slug: Slug.create("example-question"),
        });

        await inMemoryQuestionsRepo.create(newQuestion);

        const result = await sut.execute({
            slug: "example-question",
        });

        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
            }),
        });
    });
});
