# ADR-002: contracts を独立リポにし、API 契約のソースにする

- 日付: 2026-05-08
- ステータス: 採用

## 文脈

ポリレポ (ADR-001) を採用したことで、5 つのクライアントが同じ API を叩く構造になる。
クライアントごとに API 型を手書きすると必ずズレる。何らかの仕組みで型を共有する必要がある。

## 決定

**`kanban-contracts` リポを独立して立て、ここを契約のソース・オブ・トゥルースとする**。

- API I/O は **Zod スキーマ**で `kanban-contracts/src/schemas/` に定義
- API 操作 (path / method / request / response) は `src/api/` で OpenAPI registry に登録
- Zod から **OpenAPI 3.1 ドキュメント**を生成 (`src/openapi.ts` + `scripts/build-openapi.ts`)
- リリース時:
  - **TypeScript SDK** を GitHub Packages に `@kato4b61746f/kanban-contracts` として publish
  - **`openapi.yaml`** を GitHub Release のアセットとして添付

各クライアントは下記のように消費する:

| クライアント | 消費形態 |
|---|---|
| kanban-api | `@kato4b61746f/kanban-contracts` を import (Zod スキーマで request validation, 型で response) |
| kanban-web | 同上 (型付き fetch) |
| kanban-mcp | 同上 (ツール引数の型) |
| kanban-ios | `openapi.yaml` を `swift-openapi-generator` に渡して SDK 生成 |
| kanban-android | `openapi.yaml` を OpenAPI Generator (kotlin) に渡して SDK 生成 |

## 採用理由

1. **TypeScript と Swift/Kotlin で型源泉を統一できる**唯一のフォーマットが OpenAPI。
2. **Zod を起点にする**ことで、TS バックエンドでは実行時バリデーションも同じソースから得られる (重複定義を避ける)。
3. **SemVer + GitHub Packages**で「契約バージョン v1.2.3 を全クライアントに同期する」という実務的な
   リリース運用を経験できる。
4. **コード生成パイプラインを一箇所に集約**でき、各クライアントは `pnpm add` するだけ。

## トレードオフ

- **GitHub Packages の認証**が必要 (Public パッケージでも npm install には PAT が必要)。
  → 各クライアントの README とセットアップガイドで明記する必要がある。
- **`openapi.yaml` を毎回 commit する手間**: CI で `openapi:check` を回し、忘れたら落とす。
- **Zod から OpenAPI への対応で表現力に限界がある**: 必要に応じて `openapi-extensions` を直接書く可能性がある。

## 不採用案

- **gRPC / Protobuf**: 学習対象ではあるが、Web/モバイルでの取り回しが OpenAPI より煩雑。今回は不採用。
- **GraphQL**: クライアントから API を叩く設計の自由度は高いが、MCP のツール定義との相性が悪く、
  REST + OpenAPI の方が学習資産になる。
- **手書き OpenAPI**: スキーマの単一情報源が崩れ、Zod との同期で同じ型を 2 回書くことになる。
