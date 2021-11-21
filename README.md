# modularni-urad CDN

API pro servirovani statickych souboru.
Umi i resize obrazku.

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES.

#### docker-compose

Nebo muzete vyuzit [docker-compose.yml](https://docs.docker.com/compose/environment-variables/).
Prislusna sekce muze vypadat takto:

```
  open-partip-server:
    build: ./repos/open-partip-server
    image: open-partip-server
    network_mode: host
    container_name: open-partip-server
    environment:
      - PORT=3000
      - ORIGIN_URL=http://localhost:8080
      - DATABASE_URL=postgres://username:secret@localhost:5432/moje_db
      - SESSION_SECRET=string_for_securing_session_cookies
      - SHARED_SECRET=string_for_securing_JWT_tokens
```
