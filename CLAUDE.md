---
id: constitution
artifact: constitution
status: live
revised: 2026-09-26
---

# CLAUDE.md

<role>
The root policy for this repository. Only the repository owner's direct
instructions outrank it.
</role>

<project>
Meowtower ("Мяубашня") is a daily adventure game for one
primary-school girl. It checks her maths up to the end of Dutch group 8 and
gives the parent a map of what she knows. `src/` and `tests/` hold the
TypeScript server, client and their tests, `project/` keeps the method's
record, `canon/` keeps the world, and the untracked `design/` keeps the design
system, screen mock-ups and a clickable prototype.
</project>

<principles>

<principle name="project_in_english">
Write the project itself in English: code, comments, commit messages and
project documents. The owner asked for this on 2026-09-26. Text the player
sees is in Russian only for now, with one exception the owner added on
2026-09-28: the Dutch bridge's 30 to 50 keywords, kept as data beside the
Russian text and approved by the parent word by word (REQ-5080). A second
exception, added on 2026-09-29, lets the Dutch diagnostic probe of ADR-0430
show its letters in Dutch after the MVP, from text pairs the parent approves;
its story, hints and explanations stay Russian. Build the game so that English and Dutch can
be added later and the player can switch between the three languages: keep
every player-facing string out of the code in a per-language file, because a
string hard-coded in a component has to be found and moved before a second
language can ship.
</principle>

<principle name="no_commits_of_design">
Don't commit files under `design/`, because research records replace them and
they would only leave stale copies in the history. `.gitignore` excludes it.
</principle>

<principle name="no_personal_data">
Keep the player's name, age, school and family details out of every tracked
file, because the repository is public. Write "the player", and where a rule
needs a value, point to `personal/player.md`, which `.gitignore` excludes.
Before each commit, search the staged text for her name and age.
</principle>

<principle name="design_folder_layout">
Keep the layout `design/README.txt` describes: tokens and components in
`design-system/`, mock-ups in `screens/`, the prototype in `prototype/`.
`design/README.txt` tells the game code to load `design-system/tokens.css` and
`components/bundle.css` by these paths, so moving them breaks the game's
styles.
</principle>

</principles>

<gate>
`.meowpaw/profile.toml` declares a command for each verb: format
(`npx prettier --check .`), lint (`npm run lint`), check (`npx tsc --noEmit`),
test (`npm test`) and build (`npm run build && docker compose build`).
`meow-verbs run format lint check test build` runs them, and every change
passes all five before it is committed.
</gate>
