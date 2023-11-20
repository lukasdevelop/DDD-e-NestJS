import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { MakeNotification } from "test/factories/make-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";

let inMemoryNotificationsRepo: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification", () => {
    beforeEach(() => {
        inMemoryNotificationsRepo = new InMemoryNotificationsRepository();
        sut = new ReadNotificationUseCase(inMemoryNotificationsRepo);
    });

    it("should be able to read a notification", async () => {
        const notification = MakeNotification();

        inMemoryNotificationsRepo.create(notification);

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryNotificationsRepo.items[0].readAt).toEqual(expect.any(Date));
    });

    it("should not be able to read a notification from another user", async () => {
        const notification = MakeNotification({
            recipientId: new UniqueEntityID("recipient-1"),
        });

        inMemoryNotificationsRepo.create(notification);

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: "recipient-2",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
