import { fakerPT_BR } from '@faker-js/faker';
import { Topic } from '@module/topics/entities/Topic';
import { UniqueId } from '@shared/core/entities/UniqueId';
export function makeTopic(override = {}, id) {
    const topic = Topic.create({
        authorId: new UniqueId(fakerPT_BR.string.uuid()),
        content: fakerPT_BR.lorem.sentence(5),
        title: fakerPT_BR.lorem.words(8),
        ...override,
    }, id);
    return topic;
}
//# sourceMappingURL=makeTopic.js.map