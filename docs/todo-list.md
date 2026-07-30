# TODO list

## Front end

- [x] Add 404 page
- [ ] Improve color system (less color e light/dark **same color palette** but **inverted**)
- [ ] Improve card item with border on hover
- [ ] Add “fake admin” page, with a private route _/admin_ and hardcoded password
  - [ ] Under _/admin_ create a page to view/edit all the article

## Back end

- [ ] Migrate to **Neon Db** + **Drizzle**
  - [ ] Add **slug** field for url search params for article
  - [x] Migrate all article body content(article.domande) from **html** to **md**
  - [x] Update article.domande into unique field

## Shared

- [ ] Ts **.env** handling with <https://env.t3.gg/docs/nextjs> create **serverEnv.ts** & **clientEnv.ts**
