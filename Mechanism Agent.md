# Mechanism Agent

## Why the Session Appeared to Stop
The previous run reached a completion checkpoint and triggered the completion hook that expects an explicit completion signal.
This can look like a stop even when the user wants immediate continuation.

## Continuity Mechanism (Default for this Repository)
1. Continue-by-default rule.
If the user says continue, proceed immediately with implementation and do not wait for planning confirmation.

2. Completion gate rule.
Do not finish a session unless all of these are true:
- Requested scope for this turn is implemented.
- Relevant verification commands were run (tests/build/lint on changed scope).
- No unresolved blocker remains.
- A concise progress summary is ready.

3. No premature completion rule.
Do not emit final completion while there are pending execution items in the current request.

4. Hook-safe closing rule.
When closing is appropriate, always send:
- brief summary message,
- then explicit completion signal.

5. Autonomous execution loop.
For every iteration:
- pick next highest-impact independent batch,
- implement,
- verify,
- report delta,
- continue until requested scope is done.

6. Interference control.
Use separate file clusters per batch to avoid merge conflicts and regressions.

## Batch Protocol
- Start each batch with a one-line statement: purpose, action, expected outcome.
- Limit each batch to coherent files.
- Run validation before moving to the next batch.

## Recovery Protocol
If a hook or command interrupts flow:
- explain in one sentence,
- resume with the next implementation batch,
- avoid re-planning unless scope changed.

## Repository Working Rule
Maximize parallelizable workstreams and avoid overlapping edits between streams.
Use autonomous, test-backed increments until the requested implementation scope is complete.
