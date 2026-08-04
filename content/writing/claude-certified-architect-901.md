---
title: Passing Claude Certified Architect
date: 2026-06-30
status: published
excerpt: Passed Anthropic's Architect Foundations exam with 901/1000. Here are my thoughts.
---

I passed Anthropic's Claude Certified Architect Foundations exam on June 20, 2026.

Score: **901 / 1000**. Passing is 720. So yeah, I'm happy about it.

This is not a full study guide. It's what the day felt like, plus a few things I'd tell a friend who wants to sit the same exam.

## The short version of the day

It's a proctored, closed-book exam. Scenario-heavy. You're not memorizing definitions. You're picking the architecture that doesn't fall over when the agent loses context, the tool call is wrong, or the workflow gets messy halfway through.

I walked in thinking the hard part would be Claude Code trivia. It wasn't. The hard part was choosing between answers that all sounded "fine" until you asked: what breaks in production?

When the score landed at 901, it felt less like "I studied hard" and more like "I've actually built enough of this stuff that the scenarios looked familiar."

## What actually helped

1. **Ship something real first.** Agents, tools, MCP, context windows. If you've only read docs, the scenarios will feel abstract. If you've debugged a bad tool schema at 1am, they feel obvious.

2. **Read the official exam guide like it matters.** Domain weights are not decoration. Agentic architecture is a big chunk. Context and reliability is smaller but sneaky. Don't ignore the quiet domains.

3. **Practice deciding, not recalling.** Flashcards help a little. Thinking through "what would I build?" helps more. For every practice miss, write down *why* the right answer wins.

Shout out to [Claude Certification Guide](https://claudecertificationguide.com/learn). Their domain breakdown and study material helped me map what to practice instead of guessing. If you're prepping, start there.

## Who this is actually for

Architect Foundations is for people designing Claude systems end to end: agent shape, tools/MCP, evaluation, cost, safety. If you live in production tradeoffs, this track fits.

Anthropic's partner certs are split by role now. Quick map from the [Partner Certifications](https://anthropic-partners.skilljar.com/page/partner-certifications) page:

- **Associate Foundations**: consultants, sellers, delivery leads guiding Claude use cases. Does not count toward Partner Network tier eligibility.
- **Developer Foundations**: engineers building with the Claude API, Claude Code, and MCP.
- **Architect Foundations**: the one I took. Solution design and agentic architecture.
- **Architect Professional**: the next step up for deeper production architecture work.

If you're writing code against the API every day, look at Developer. If you're shaping how agents should behave in a real product, Architect is the better flex. And if you're mostly advising customers, Associate exists for that.

## If you're about to take it

You don't need a three-month ritual. You need hands-on reps and a clear map of the domains.

Build a small agent. Wire a tool. Break context on purpose and fix it. Then book the exam while that stuff is still fresh.

And when you get your score, tell someone. That's half the fun.
