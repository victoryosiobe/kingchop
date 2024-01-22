# TODOS
- Make sentence tokenizer, split after " ", or “ ” if there's a . or ? or ! lastly within, put space into consideration after them. quotes like ‘ ’ which also falls in this category will be implemented in next version. The problems are much.
- `they went, though (laugh), they didn't` as sentence, breaks to `[ 'they went,', 'though', '(laugh),', "they didn't" ]`. It would be nice to have the though and (laugh) as a value, but we have a rule to highlight enclosers, hence, we split before and after them. Do we suspend the rule? Decision ’n' implementation in next version.
- still improve correctText in next update.
- Enclosers issues undone.