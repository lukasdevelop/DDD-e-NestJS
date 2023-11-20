import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
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
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";

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

describe("On Question Best Answer Chosen", () => {
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

        new OnQuestionBestAnswerChosen(
            inMemoryAnswersRepo,
            sendNotificationUseCase,
        );
    });

    it("should send a notification when question has new best a answer chosen", async () => {
        const question = MakeQuestion();
        const answer = MakeAnswer({ questionId: question.id });

        inMemoryQuestionsRepo.create(question);
        inMemoryAnswersRepo.create(answer);

        question.bestAnswerId = answer.id;

        inMemoryQuestionsRepo.save(question);

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
        });
    });
});
