import { Topic } from '@module/topics/entities/Topic'
import { TopicsRepository } from '@module/topics/repositories/contracts/TopicsRepository'
import { FindManyRecentProps } from '@module/topics/repositories/types/FindManyRecent'
import { TopicDetails } from '@module/topics/valueObjects/TopicDetails'
import { TopicWithAuthor } from '@module/topics/valueObjects/TopicWithAuthor'
import { UniqueId } from '@shared/core/entities/UniqueId'
import { UsersInMemoryRepository } from '@test/module/user/repositories/UsersInMemoryRepository'

export class TopicsInMemoryRepository implements TopicsRepository {
  constructor(private readonly usersRepository: UsersInMemoryRepository) {}

  topics: Topic[] = []

  async save(topic: Topic): Promise<void> {
    const topicIndex = this.topics.findIndex((topicI) =>
      topicI.id.equals(topic.id),
    )
    this.topics[topicIndex] = topic
  }

  async create(topic: Topic): Promise<void> {
    this.topics.push(topic)
  }

  async findById(id: string): Promise<Topic | null> {
    const topic = this.topics.find((topic) => topic.id.equals(new UniqueId(id)))
    return topic ?? null
  }

  async delete(id: string): Promise<void> {
    this.topics = this.topics.filter(
      (topic) => !topic.id.equals(new UniqueId(id)),
    )
  }

  async findManyRecentWithAuthor({
    page,
    perPage,
  }: FindManyRecentProps): Promise<TopicWithAuthor[]> {
    const topics = this.topics
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage)

    const topicsWithAuthor: TopicWithAuthor[] = topics.map((topic) => {
      const user = this.usersRepository.users.find((u) =>
        u.id.equals(topic.authorId),
      )

      if (!user) {
        throw Error('User not created for topic')
      }

      const topicWithAuthor = TopicWithAuthor.create({
        authorId: user.id,
        authorName: user.name,
        topicContent: topic.content,
        topicCreatedAt: topic.createdAt,
        topicId: topic.id,
        topicUpdatedAt: topic.updatedAt,
        topicTitle: topic.title,
      })

      return topicWithAuthor
    })

    return topicsWithAuthor
  }

  findByIdWithDetails(): Promise<TopicDetails | null> {
    throw new Error('Method not implemented.')
  }
}
