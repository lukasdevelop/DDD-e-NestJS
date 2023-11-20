import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recents-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepo);
    });

    it("should be able to fetch paginated recent questions", async () => {
        await inMemoryQuestionsRepo.create(
            MakeQuestion({ createdAt: new Date(2022, 0, 20) }),
        );
        await inMemoryQuestionsRepo.create(
            MakeQuestion({ createdAt: new Date(2022, 0, 18) }),
        );
        await inMemoryQuestionsRepo.create(
            MakeQuestion({ createdAt: new Date(2022, 0, 23) }),
        );

        const result = await sut.execute({
            page: 1,
        });

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ]);
    });

    it("should be able to fetch recent questions", async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionsRepo.create(MakeQuestion());
        }

        const result = await sut.execute({
            page: 2,
        });

        expect(result.value?.questions).toHaveLength(2);
    });
});
