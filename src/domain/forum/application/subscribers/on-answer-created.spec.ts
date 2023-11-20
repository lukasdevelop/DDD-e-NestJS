import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { OnAnswerCreated } from "./on-answer-created";
import { MakeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import {
    SendNotificationUseCase,
    SendNotificationUseCaseRequest,
    SendNotificationUseCaseResponse,
} from "@/domain/notification/application/use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { MakeQuestion } from "test/factories/make-question";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";

let inMemoryQuestionAttachmentsRepo: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepo: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepo: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepo: InMemoryAnswersRepository;
let inMemoryNotificationsRepo: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Answer Created", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepo =
      new InMemoryQuestionAttachmentsRepository();
        inMemoryQuestionsRepo = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepo,
        );
        inMemoryAnswerAttachmentsRepo = new InMemoryAnswerAttachmentsRepository();

        inMemoryAnswersRepo = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepo,
        );
        inMemoryNotificationsRepo = new InMemoryNotificationsRepository();

        sendNotificationUseCase = new SendNotificationUseCase(
            inMemoryNotificationsRepo,
        );

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

        new OnAnswerCreated(inMemoryQuestionsRepo, sendNotificationUseCase);
    });

    it("should send a notification when an answer is created", async () => {
        const question = MakeQuestion();
        const answer = MakeAnswer({ questionId: question.id });

        inMemoryQuestionsRepo.create(question);
        inMemoryAnswersRepo.create(answer);

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});
