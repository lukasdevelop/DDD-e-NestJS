import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allow-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { answerComment: AnswerComment }
>;

export class CommentOnAnswerUseCase {
    constructor(
    private answerRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({
        authorId,
        answerId,
        content,
    }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        });

        await this.answerCommentsRepository.create(answerComment);

        return right({ answerComment });
    }
}
