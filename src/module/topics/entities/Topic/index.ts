import { AggregateRoot } from '@shared/core/entities/AggregateRoot'
import { UniqueId } from '@shared/core/entities/UniqueId'
import { Optional } from '@shared/core/types/optional'
import { TopicCommentsList } from '../TopicCommentsList'

export interface TopicProps {
  authorId: UniqueId
  title: string
  content: string
  createdAt: Date
  updatedAt: Date | null
  comments: TopicCommentsList
  isDeleted: boolean
}

export class Topic extends AggregateRoot<TopicProps> {
  static create(
    props: Optional<
      TopicProps,
      'updatedAt' | 'createdAt' | 'comments' | 'isDeleted'
    >,
    id?: UniqueId,
  ) {
    const topicProps: TopicProps = {
      authorId: props.authorId,
      createdAt: props.createdAt ?? new Date(),
      title: props.title,
      content: props.content,
      updatedAt: props.updatedAt ?? null,
      comments: props.comments ?? new TopicCommentsList(),
      isDeleted: props.isDeleted ?? false,
    }

    const topic = new Topic(topicProps, id)

    return topic
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    if (!title) {
      return
    }

    this.props.title = title
    this.update()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    if (!content) {
      return
    }

    this.props.content = content
    this.update()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get comments() {
    return this.props.comments
  }

  update() {
    this.props.updatedAt = new Date()
  }
  
  get isDeleted() {
    return this.props.isDeleted
  }

  set isDeleted(value: boolean) {
    this.props.isDeleted = value
  }
}
