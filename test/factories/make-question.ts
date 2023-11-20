import { faker } from "@faker-js/faker";
import {
    Question,
    QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export function MakeQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityID,
) {
    const question = Question.create(
        {
            title: faker.lorem.sentence(),
            slug: Slug.create("example-question"),
            authorId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    );

    return question;
}
