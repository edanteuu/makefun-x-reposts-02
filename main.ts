// Entry for makefun-x-reposts-02 (Node 22, standard library only): it reads
// POSTS.json from the repository root, checks it names 1 to 15 of our own X
// posts, and copies it to /output/POSTS.json, where the gate reads it. The
// entry is the posts themselves: seven quote-tweets from @URSAprotocol, each
// quoting a different one of make.fun's newest posts on x.com/makefunai, each
// carrying @makefunai and the play code makefun-flagpole-rabbit-jade in its
// own words. Nothing this program writes about the posts is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postsPath = join(BOT_DIR, 'POSTS.json');
const posts = JSON.parse(readFileSync(postsPath, 'utf8')) as { posts: unknown };

if (!Array.isArray(posts.posts) || posts.posts.length < 1 || posts.posts.length > 15) {
  console.error('POSTS.json must name 1 to 15 posts');
  process.exit(1);
}

const isStatusAddress = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^(https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/[0-9]+)$/.test(value);
for (const url of posts.posts) {
  if (!isStatusAddress(url)) {
    console.error(`Not an X post address: ${String(url)}`);
    process.exit(1);
  }
}
if (new Set(posts.posts).size !== posts.posts.length) {
  console.error('POSTS.json names the same post twice');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(postsPath, join(OUTPUT_DIR, 'POSTS.json'));
console.log(`Copied ${posts.posts.length} post addresses to ${join(OUTPUT_DIR, 'POSTS.json')}`);
