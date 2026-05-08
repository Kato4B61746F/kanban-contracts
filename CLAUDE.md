# CLAUDE.md

このファイルは Claude Code 向けの指示書。このリポで作業するときは必ず参照する。

## このリポの目的

`kanban-contracts` は kanban プロジェクトの **API 契約 (OpenAPI 3.1) と TypeScript の型** を一元管理する。
すべてのクライアント (`kanban-api`, `kanban-web`, `kanban-mcp`, `kanban-ios`, `kanban-android`) は
ここから生成・配布される SDK や `openapi.yaml` に依存する。

**「この変更は契約 (API I/O) に影響するか?」** が常に最初に確認する観点。
影響するなら、SemVer の major/minor 判断と consumers (kanban-api 等) の追従計画も合わせて Issue/PR に書く。

## ディレクトリ構成

- `src/schemas/` — エンティティ DTO の Zod スキーマ (User / Workspace / Board / List / Card / ...)
- `src/api/` — API 操作 (request/response/path) を OpenAPI registry に登録
- `src/openapi.ts` — registry を OpenAPI 3.1 ドキュメントに変換
- `scripts/build-openapi.ts` — `openapi.yaml` をディスクに書き出す (CI で diff 検出)
- `tests/` — Vitest テスト
- `docs/adr/` — Architecture Decision Records (なぜその選択をしたか)
- `docs/domain.md` / `docs/er.md` — ドメインモデルと ER 図

## コーディング規約

- **TypeScript strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes** を遵守
- import は ESM のみ (`type: module`、相対 import は拡張子 `.js` 必須)
- **型と値を分けて import** (`import type { X } from '...'`) — ESLint で強制
- スキーマ命名: 単数 PascalCase で `User`, `Card` (DTO)。入力用は `CreateCardInput`, `UpdateCardInput`
- 日付・時刻は ISO 8601 文字列 (`z.string().datetime()`)
- ID は `z.string().uuid()` (Postgres `uuid` カラム前提)
- nullable フィールドは `.nullable()` で明示。`undefined` と `null` を混在させない

## やること / やらないこと

- ✅ Zod スキーマ追加・修正
- ✅ OpenAPI registry に API 操作を登録
- ✅ `openapi.yaml` の差分を必ずコミット (CI が検証する)
- ✅ Conventional Commits (`feat:` `fix:` `chore:` `docs:` `refactor:` `test:`)
- ❌ DB スキーマや実装ロジックは書かない (それは `kanban-api` の責務)
- ❌ 認証フローの実装は書かない (request/response の型のみ)
- ❌ `package.json` の `version` を勝手に上げない (リリースワークフローで PR 経由)

## ワークフロー

1. Issue を確認、なければ作る
2. ブランチ名: `feat/<issue-number>-<short-desc>`
3. 変更後、必ず実行:
   - `pnpm format`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
   - `pnpm openapi:build` (差分があれば `openapi.yaml` をコミット)
4. PR 作成時: `Closes #N` を本文に書く / 破壊的変更の有無を明記
5. PR タイトルは Conventional Commits

## SemVer 判断

| 変更 | bump |
|---|---|
| 新フィールド (任意) を追加 | minor |
| 新 API 操作を追加 | minor |
| 既存フィールドを必須化 | **major** |
| 既存フィールドを削除 | **major** |
| 型を狭める (例: string → enum) | **major** |
| 型を広げる (例: enum → string) | minor |
| バグ修正で挙動変更なし | patch |

迷ったら **major** に倒す (consumers が破壊的変更を意図せず受けるよりは、明示的に上げる方が安全)。

## 関連リポ

- `kanban-api` — Hono バックエンド (この型を import して使う)
- `kanban-web` — Next.js (この型を fetch クライアントに使う)
- `kanban-mcp` — MCP サーバー (この型をツール引数に使う)
- `kanban-ios` / `kanban-android` — `openapi.yaml` から SDK 自動生成
