import { Injectable } from '@infra/containers/Injectable'
import { Comment } from '@module/comments/entities/Comment'
import { CommentNotFoundError } from '@module/comments/errors/CommentNotFoundError'
import { CommentsRepository } from '@module/comments/repositories/contracts/CommentsRepository'
import { TopicNotFoundError } from '@module/topics/errors/TopicNotFoundError'
import { TopicsRepository } from '@module/topics/repositories/contracts/TopicsRepository'
import { UserNotFoundError } from '@module/users/errors/UserNotFoundError'
import { UsersRepository } from '@module/users/repositories/contracts/UsersRepository'
import { Either, left, right } from '@shared/core/errors/Either'
import { UseCase } from '@shared/core/module/UseCase'
import { inject, injectable } from 'tsyringe'

interface Request {
  content: string
  authorId: string
  topicId: string
}

type Response = Either<
  CommentNotFoundError | UserNotFoundError,
  {
    comment: Comment
  }
>

@injectable()
export class CreateCommentUseCase implements UseCase<Request, Response> {
  constructor(
    @inject(Injectable.Repositories.Topics)
    private readonly topicsRepository: TopicsRepository,

    @inject(Injectable.Repositories.Comments)
    private readonly commentsRepository: CommentsRepository,

    @inject(Injectable.Repositories.Users)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ content, authorId, topicId }: Request): Promise<Response> {
    const userExists = await this.usersRepository.findById(authorId)

    if (!userExists) {
      return left(new UserNotFoundError())
    }

    const topicExists = await this.topicsRepository.findById(topicId)

    if (!topicExists) {
      return left(new TopicNotFoundError())
    }

    const comment = Comment.create({
      content,
      authorId: userExists.id,
      topicId: topicExists.id,
    })

    await this.commentsRepository.create(comment)

    return right({ comment })
  }
}
