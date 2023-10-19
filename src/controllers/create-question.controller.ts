import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestiontBodySchema = z.infer<typeof createQuestionBodySchema>


@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
    constructor(private prisma: PrismaService) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestiontBodySchema,
        @CurrentUser() user: UserPayload
    ){
    const { title, content } = body
    const userId = user.sub

    await this.prisma.question.create({
        data: {
            authorId: userId,
            title,
            content,
            slug: 'teste' 
        }
    })
    }
}