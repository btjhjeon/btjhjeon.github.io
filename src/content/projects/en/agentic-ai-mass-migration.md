---
title: "Agentic AI and Harness Engineering for Mass Migration"
summary: "An Agentic AI pilot that automated the assessment-to-migration lifecycle for a major Korean telecommunications carrier's large-scale AWS transformation program."
org: "Amazon Web Services (AWS)"
role: "Tech Lead, Agentic AI Pilot"
startDate: 2026-01-01
endDate: 2026-05-01
tags: ["Agentic AI", "Harness Engineering", "Cloud Migration", "AWS", "Strands Agents"]
featured: true
---

## Overview

I led the Agentic AI pilot within an All-in Migration program to move approximately 100 on-premises legacy services to AWS. Across four pilot services, we automated the lifecycle from initial assessment and code diagnosis through architecture design, code transformation, and testing, then validated the approach for the broader migration program.

The central challenge extended beyond code generation. Developers from multiple partner organizations had widely varying levels of AI proficiency, while every transformed service still had to comply with the same enterprise architecture and security policies. I addressed both the technical workflow and this capability gap through a reusable agent system and Harness Engineering.

## My Contributions

- Defined the technical direction, end-to-end agent workflow, and quantitative evaluation criteria for the four-service pilot.
- Designed and built four specialized AI agents—Discovery, Code Analyzer, Design Doc, and Unit Test—using Amazon Bedrock AgentCore and the Strands Agents SDK. Their structured outputs connected the assessment, design, migration, and validation stages.
- Combined AWS Transform with Amazon Kiro to automate both repeatable code changes and complex, knowledge-guided transformations.
- Introduced a Harness Engineering framework comprising Agents, Powers, Skills, and Steering, along with a CLI that automatically configured each developer's workspace with enterprise security policies and proven migration practices.
- Established a knowledge flywheel that converted completed migration patterns into reusable Skills, allowing every subsequent service to start with more accumulated context and less dependence on individual expertise.
- Validated the agents and harness as the standard delivery model for scaling the approach across the broader migration program.

## Results

- **40% less code diagnosis effort** — Reduced diagnosis and remediation planning from 5 to 3 person-days per service.
- **50% less code modification effort** — Reduced code transformation from 100 to 50 person-days per service.
- **80.6% migration automation** — Increased the automation rate from 48.6% to 80.6%, exceeding the 60% target.
- **Design drafts in under 30 minutes** — Reduced the initial To-Be design-document workflow from several days to less than 30 minutes per service.
- **90% average branch coverage** — Automatically generated and validated unit tests for 139 methods.

## Why Harness Engineering Mattered

Harness Engineering made organizational knowledge part of the agents' working context instead of leaving it in documents or with individual developers. Skills captured repeatable implementation patterns, Steering applied security and coding policies, Powers packaged tools and workflows, and the CLI assembled them consistently for each project. As the pilot progressed, knowledge-guided transformation coverage grew and human-dependent work shrank, creating a system that became more effective with every migrated service.
