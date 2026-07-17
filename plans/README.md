# Animation implementation plans

| #   | Plan                              | Severity | Status | Depends on |
| --- | --------------------------------- | -------- | ------ | ---------- |
| 001 | Atlassian task-loop spotlight     | HIGH     | DONE   | —          |
| 002 | Spacejoy poster-to-viewer handoff | MEDIUM   | DONE   | 001        |
| 003 | Queans pipeline pass              | LOW      | DONE   | 001        |
| 004 | Restrained pointer feedback       | MEDIUM   | DONE   | 001        |
| 005 | Remove keyboard panel motion      | HIGH     | DONE   | 001        |
| 006 | Atlassian review remediation      | HIGH     | DONE   | 001        |
| 007 | Spacejoy review remediation       | HIGH     | DONE   | 002        |
| 008 | Queans review remediation         | MEDIUM   | DONE   | 003        |
| 009 | Scoped reduced-motion fallback    | MEDIUM   | DONE   | 004        |
| 010 | Queans first-frame race           | HIGH     | DONE   | 008        |

## Recommended execution order

1. Execute 001 first. It installs Motion and establishes shared motion tokens,
   reduced-motion detection, and viewport-entry behavior.
2. Execute 002, 003, 004, and 005 after 001. They touch separate feature files
   and can be implemented independently.
3. Run the full quality gate and then the strict animation review.
4. Any blocking review finding becomes the next heartbeat before publication
   or deployment.
5. Plans 006–009 are that review heartbeat. Run another strict review after
   all four are complete.
6. Plan 010 is the final first-frame race found by that second strict review.
