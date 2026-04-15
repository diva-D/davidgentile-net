# Reddit — r/artificial (conditional, Day 14+)

**Subreddit:** r/artificial (~1.1M)
**Format:** self post, full text inline, link in first comment
**Asset:** none in the post body
**Post URL:** https://davidgentile.net/friction-tax

**Conditional:** Only post here if r/productivity cleared ~50 upvotes. This sub rewards the AI angle specifically; wasted here if the earlier posts flopped.

## Title

The real unlock from LLMs isn't chat. It's that structure inside unstructured inputs is now free to extract.

## Body

Every email, ticket, Slack message, transcript, and free-text form field has hidden structure inside it. A person, a request, a deadline, a status, a next action, a category. Knowledge work has always been about pulling that structure out and doing something with it.

For decades the answer has been "impose a schema." GTD, CRMs, ticket trackers, PARA, every workflow tool. Same move: give every item typed fields, then the question "what do I do next" becomes a filter instead of a re-read.

None of it stuck at scale. Not because the schemas were wrong. Because a human had to sit there and populate them. Read the email, pick the fields, type the values. That parser job is dull enough that the raw pile usually wins.

This is the actual unlock from modern LLMs. Not chat. Not copilots. Not "ask your docs." The unlock is that structured extraction is effectively free. You can let the model turn an unstructured input into a typed object at ingest, before any human touches it. Every downstream question becomes a filter against the typed store instead of a re-read of the raw.

Most of the productivity-software industry is still selling chat on top of unstructured data. That's backwards. The move is to type at ingest and leave the chat layer for the exceptions.

## First comment (post immediately after)

Full write-up with an interactive demo: https://davidgentile.net/friction-tax

Curious what people are actually seeing in production. Extract-at-ingest sounds obvious; it's surprisingly rare in shipped products. Is that an accuracy problem, a latency problem, or just a product-design blind spot?

## Notes

- AI-centric framing. GTD is background color, not the hook.
- Ends with a specific open question to invite technical discussion.
- The "that's backwards" line is the voice. Keep it.
