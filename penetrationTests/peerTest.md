# Penetration Testing

## Jordan Hiatt and Grant Gardner

## Self Attacks:

### Peer 1: Grant Gardner

#### Attack 1 — Brute Force Login

| Item           | Value                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 17:20                                                                                                                                                                                                                                  |
| Target         | pizza-service.329pizzas.click                                                                                                                                                                                                                     |
| Classification | Identification and Authentication Failures                                                                                                                                                                                                        |
| Severity       | 0 — Unsuccessful                                                                                                                                                                                                                                  |
| Description    | Used Turbo Intruder against PUT /api/auth with admin@jwt.pizza and /usr/share/dict/words wordlist. No successful logins were returned. Rate limiting (20 requests per 15 min) and CloudFront-level blocking prevented the attack from completing. |
| Corrections    | Rate limiter added to login and register endpoints (20 req / 15 min window).                                                                                                                                                                      |

#### Attack 2 — JWT Algorithm Confusion (alg:none)

| Item           | Value                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 17:45                                                                                                                                                                       |
| Target         | pizza-service.329pizzas.click                                                                                                                                                          |
| Classification | Cryptographic Failures                                                                                                                                                                 |
| Severity       | 0 — Unsuccessful                                                                                                                                                                       |
| Description    | Forged a JWT with alg:none and an Admin role in the payload. The server returned 401, rejecting the token. The fix enforcing algorithms: ['HS256'] in jwt.verify is working correctly. |
| Corrections    | jwt.sign now specifies algorithm: 'HS256'. jwt.verify now enforces { algorithms: ['HS256'] }, rejecting tokens with any other algorithm including none.                                |

#### Attack 3 — IDOR / Privilege Escalation

| Item           | Value                                                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 17:54                                                                                                                                                                                                                                                                        |
| Target         | pizza-service.329pizzas.click                                                                                                                                                                                                                                                           |
| Classification | Broken Access Control                                                                                                                                                                                                                                                                   |
| Severity       | 0 — Unsuccessful                                                                                                                                                                                                                                                                        |
| Description    | Attempted to modify another user's profile (PUT /api/user/1) using a diner token. Server returned 403 unauthorized. Also attempted to self-escalate by submitting a roles field on own account — the field is silently ignored by the server (only name, email, password are accepted). |
| Corrections    | Access check (user.id !== userId) blocks cross-user writes. Role updates are not accepted via the update endpoint.                                                                                                                                                                      |

#### Attack 4 — Information Disclosure via /api/docs

| Item           | Value                                                                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 17:58                                                                                                                                                                                                                                                                 |
| Target         | pizza-service.329pizzas.click                                                                                                                                                                                                                                                    |
| Classification | Security Misconfiguration                                                                                                                                                                                                                                                        |
| Severity       | 1 — Low                                                                                                                                                                                                                                                                          |
| Description    | GET /api/docs is publicly accessible with no authentication. Previously exposed factory URL and DB host in a config field. After remediation the config field is absent, but the full endpoint map including the chaos testing route remains visible to unauthenticated callers. |
| Corrections    | Removed config field from docs response.                                                                                                                                                                                                                                         |

#### Attack 5 — Resource Exhaustion DoS

| Item           | Value                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------------------- |
| Date           | 2026-04-10 18:01                                                                                                                                                            |
| Target         | pizza-service.329pizzas.click                                                                                                                                               |
| Classification | Insecure Design                                                                                                                                                             |
| Severity       | 0 — Unsuccessful                                                                                                                                                            |
| Description    | Sent GET /api/franchise?limit=99999 and concurrent requests. No measurable latency increase or failures observed. The limit clamping fix (max 100) is deployed and working. |
| Corrections    | limit parameter clamped to Math.min(100, Math.max(1, parseInt(limit)                                                                                                        |     | 10)) before use in SQL. |

### Peer 2: Jordan Hiatt

#### Attack 1:

| Item           | Result                                                             |
| -------------- | ------------------------------------------------------------------ |
| Date           | April 10, 2026                                                     |
| Target         | pizza-service.jordanhiatt.org                                      |
| Classification | Broken Object Level Authorization (BOLA)                           |
| Severity       | 0                                                                  |
| Description    | Attempted to use my auth token to access someone elses information |
| Images         | ![](Attack1.png)                                                   |
| Corrections    | None, user was not authorized                                      |

#### Attack 2:

| Item           | Result                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 10, 2026                                                                                                                            |
| Target         | pizza-service.jordanhiatt.org                                                                                                             |
| Classification | Injection                                                                                                                                 |
| Severity       | 0                                                                                                                                         |
| Description    | Attempted to gain login access by using a sql command                                                                                     |
| Images         | ![](/jwt-pizza/penetrationTests/Attack2A.png) ![](/jwt-pizza/penetrationTests/Attack2B.png) ![](/jwt-pizza/penetrationTests/Attack2C.png) |
| Corrections    | None, user was unable to bypass login credentials                                                                                         |

#### Attack 3:

| Item           | Result                                        |
| -------------- | --------------------------------------------- |
| Date           | April 10, 2026                                |
| Target         | pizza-service.jordanhiatt.org                 |
| Classification | Injection                                     |
| Severity       | 0                                             |
| Description    | Attempted to drop a table using sql injection |
| Images         | ![](/jwt-pizza/penetrationTests/Attack3.png)  |
| Corrections    | None, user was unable to drop any tables      |

#### Attack 4:

| Item           | Result                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 10, 2026                                                                                                                            |
| Target         | pizza.jordanhiatt.org                                                                                                                     |
| Classification | Security Misconfiguration                                                                                                                 |
| Severity       | 0                                                                                                                                         |
| Description    | Looked for a .env file and through the robots.txt to see if any valuable secrets were published to the website.                           |
| Images         | ![](/jwt-pizza/penetrationTests/Attack4A.png) ![](/jwt-pizza/penetrationTests/Attack4B.png) ![](/jwt-pizza/penetrationTests/Attack4C.png) |
| Corrections    | None, no secrets were exposed in either of these 2 documents.                                                                             |

#### Attack 5:

| Item           | Result                                                     |
| -------------- | ---------------------------------------------------------- |
| Date           | April 10, 2026                                             |
| Target         | pizza.jordanhiatt.org                                      |
| Classification | Security Misconfiguration                                  |
| Severity       | 1                                                          |
| Description    | Stack trace was sent back when an error was found          |
| Corrections    | Remove the stack trace default send in the service.js file |

## Peer Attack:

### Peer 1 attack on Peer 2

#### Attack 1 — Default Credential Login

| Item           | Value                                                                                                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | 2026-04-10 18:10                                                                                                                                                                                                                                                                     |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                                                                                                                        |
| Classification | Identification and Authentication Failures                                                                                                                                                                                                                                           |
| Severity       | 3 — Critical                                                                                                                                                                                                                                                                         |
| Description    | Attempted login with default credentials exposed in the /api/docs endpoint (a@jwt.com / admin). Login succeeded immediately, granting full admin access. Default franchisee and diner credentials also worked. The API docs include example credentials that are live on the server. |
| Corrections    | Change all default credentials. Remove credential examples from public-facing docs. Enforce first-login password reset for seeded accounts.                                                                                                                                          |

#### Attack 2 — Brute Force Login (Burp Intruder)

| Item           | Value                                                                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 18:15                                                                                                                                                                                                                                                       |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                                                                                                          |
| Classification | Identification and Authentication Failures                                                                                                                                                                                                                             |
| Severity       | 0 — Unsuccessful                                                                                                                                                                                                                                                       |
| Description    | Ran a broad credential stuffing attack using Burp Suite Intruder against PUT /api/auth. The default admin credentials weren't detected by the intruder scan, confirming the finding from Attack 1. No rate limiting or account lockout was observed to block the scan. |
| Corrections    | Implement rate limiting on the login endpoint. Add account lockout after repeated failures.                                                                                                                                                                            |

#### Attack 3 — JWT Cryptography / Algorithm Confusion

| Item           | Value                                                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 18:25                                                                                                                                                                                         |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                                            |
| Classification | Cryptographic Failures                                                                                                                                                                                   |
| Severity       | 0 — Unsuccessful                                                                                                                                                                                         |
| Description    | Attempted JWT algorithm confusion attacks including alg:none and RS/HS key confusion. The server correctly rejected forged tokens. No cryptographic weaknesses were found in the token validation logic. |
| Corrections    | None required. JWT verification is correctly enforcing algorithm constraints.                                                                                                                            |

#### Attack 4 — IDOR / Privilege Escalation

| Item           | Value                                                                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | 2026-04-10 18:30                                                                                                                                                                                                                                                         |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                                                                                                            |
| Classification | Broken Access Control                                                                                                                                                                                                                                                    |
| Severity       | 0 — Unsuccessful                                                                                                                                                                                                                                                         |
| Description    | Attempted to access and modify other users' data via PUT /api/user/:userId and GET /api/franchise/:userId using a low-privilege token. Cross-user access was tested by substituting other user IDs in the path. The server correctly rejected all unauthorized requests. |
| Corrections    | None required. Access controls on user-scoped routes are functioning correctly.                                                                                                                                                                                          |

#### Attack 5 — Information Disclosure via /api/docs

| Item           | Value                                                                                                                                                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | 2026-04-10 18:10                                                                                                                                                                                                                                                                                                                     |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                                                                                                                                                                        |
| Classification | Security Misconfiguration                                                                                                                                                                                                                                                                                                            |
| Severity       | 2 — Medium                                                                                                                                                                                                                                                                                                                           |
| Description    | GET /api/docs is publicly accessible with no authentication. The response includes a config block that exposes internal infrastructure: factory service URL (https://pizza-factory.cs329.click) and database hostname (pizza-db.jordanhiatt.org). This gives an attacker a complete map of backend services without any credentials. |
| Corrections    | Remove the config block from the docs response. Restrict /api/docs to authenticated or admin users, or remove it from production entirely.                                                                                                                                                                                           |

#### Attack 6 — Resource Exhaustion DoS

| Item           | Value                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | 2026-04-10 18:40                                                                                                                                                                      |
| Target         | pizza-service.jordanhiatt.org                                                                                                                                                         |
| Classification | Insecure Design                                                                                                                                                                       |
| Severity       | 0 — Unsuccessful                                                                                                                                                                      |
| Description    | Sent high-volume concurrent requests to public endpoints to test for latency degradation or failure. No measurable slowdown was observed. The service handled the load without issue. |
| Corrections    | None required. Service demonstrated adequate resilience under load.                                                                                                                   |

### Peer 2 attack on Peer 1:

#### Attack 1:

| Item           | Result                                                             |
| -------------- | ------------------------------------------------------------------ |
| Date           | April 13, 2026                                                     |
| Target         | https://pizza-service.329pizzas.click/                             |
| Classification | Broken Object Level Authorization (BOLA)                           |
| Severity       | 0                                                                  |
| Description    | Attempted to use my auth token to access someone elses information |
| Images         | ![](PeerAttack1.png)                                               |
| Corrections    | None, user was not authorized                                      |

#### Attack 2:

| Item           | Result                                                            |
| -------------- | ----------------------------------------------------------------- |
| Date           | April 13, 2026                                                    |
| Target         | https://pizza-service.329pizzas.click/                            |
| Classification | Injection                                                         |
| Severity       | 0                                                                 |
| Description    | Attempted to gain login access by using a sql command             |
| Images         | ![](PeerAttack2A.png) ![](PeerAttack2B.png) ![](PeerAttack2C.png) |
| Corrections    | None, user was not authorized                                     |

#### Attack 3:

| Item           | Result                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                            |
| Target         | https://pizza-service.329pizzas.click/                                    |
| Classification | Brute Force Attack                                                        |
| Severity       | 0                                                                         |
| Description    | Attempted to brute force into application                                 |
| Corrections    | None, login was rate limited to 20 requests and made it super inefficient |

#### Attack 4:

| Item           | Result                                                              |
| -------------- | ------------------------------------------------------------------- |
| Date           | April 13, 2026                                                      |
| Target         | https://pizza-service.329pizzas.click/                              |
| Classification | Security Misconfiguration                                           |
| Severity       | 0                                                                   |
| Description    | Attempted to find secrets and vulnerabilites in robots.txt and .env |
| Images         | ![](PeerAttack4A.png) ![](PeerAttack4B.png) ![](PeerAttack4C.png)   |
| Corrections    | None, secrets were left out or discovered in these common files     |

#### Attack 5:

| Item           | Result                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| Date           | April 13, 2026                                                              |
| Target         | https://pizza-service.329pizzas.click/                                      |
| Classification | Broken Access Control                                                       |
| Severity       | 0                                                                           |
| Description    | Attempted to change my role from diner to admin by changing the header body |
| Images         | ![](PeerAttack5.png)                                                        |
| Corrections    | None, user role returned as diner. No elevation changed                     |

### Combined Summary of Learnings:

- Remove live credentials from my docs page
- Ensure that stack traces aren't returned with errors
- Input data sanitization is important to prevent SQL injections
- Correct Authentication logic will from unauthorized access
- Make document pages require authorization
- Authentication hygiene matters most.
- Public documentation endpoints can still leak meaningful attack surface even when direct exploitation is blocked.
- Access control and JWT verification defenses were effective in the tested scenarios.
- Rate limiting and defensive input bounds reduced the impact of brute force and resource exhaustion attempts.
