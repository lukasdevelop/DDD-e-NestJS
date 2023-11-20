import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationsRepo: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification", () => {
    beforeEach(() => {
        inMemoryNotificationsRepo = new InMemoryNotificationsRepository();
        sut = new SendNotificationUseCase(inMemoryNotificationsRepo);
    });

    it("should be able to send a notification", async () => {
        const result = await sut.execute({
            recipientId: "1",
            title: "Nova notificação",
            content: "Conteúdo da notificação",
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationsRepo.items[0]).toEqual(
            result.value?.notification,
        );
    });
});
