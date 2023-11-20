import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";

interface FetchRecentsQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentsQuestionsUseCaseResponse = Either<
  null,
  { questions: Question[] }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
    constructor(private questionRepository: QuestionsRepository) {}

    async execute({
        page,
    }: FetchRecentsQuestionsUseCaseRequest): Promise<FetchRecentsQuestionsUseCaseResponse> {
        const questions = await this.questionRepository.findManyRecent({ page });

        return right({ questions });
    }
}
