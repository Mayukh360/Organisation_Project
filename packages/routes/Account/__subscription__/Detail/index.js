/*
 * PACKAGES
 */
import Tag from 'tag'


/*
 * EXPORTS
 */
export default {
  'subscribe': (__, { accountId }, Context) => Context.Pubsub.subscribe(Tag.Account.Detail(accountId)),
  'resolve': __data => __data
}
