import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
    constructor(private prisma: PrismaService){}
    
    async findById(id: string): Promise<Answer | null> {
        const answer = await this.prisma.answer.findUnique({
            where: {
                id
            }
        })

        if(!answer){
            return null
        }

        return PrismaAnswerMapper.toDomain(answer)
    }

    async findManyByAnswerId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        const answers = await this.prisma.answer.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return answers.map( question => {
            return PrismaAnswerMapper.toDomain(question)
        })
    }

    async create(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prisma.answer.create({
            data
        })    
    }

    async save(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)
     
        await this.prisma.answer.update({
            where: {
                id: data.id
            },
            data
        })
    }

    async delete(answer: Answer): Promise<void> {
        await this.prisma.question.delete({
            where: {
                id: answer.id.toString()
            }
        })
    }
}