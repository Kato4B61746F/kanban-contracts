# kanban-contracts

OpenAPI 3.1 + Zod schemas for **kanban** — single source of truth for all clients
(`kanban-api` / `kanban-web` / `kanban-mcp` / `kanban-ios` / `kanban-android`).

## なぜこのリポがあるか

複数のクライアント (バックエンド・Web・MCP・iOS・Android) が同じ API を消費する。
**契約をひとつのリポにまとめ、ここからのみ型・SDK・OpenAPI 仕様を配布する**ことで、
クライアントごとに型がズレる事故を防ぐ。

## ここから配布されるもの

| 形式 | 配布先 | 使う側 |
|---|---|---|
| TypeScript SDK (Zod 込み) | GitHub Packages: `@kato4b61746f/kanban-contracts` | `kanban-api`, `kanban-web`, `kanban-mcp` |
| `openapi.yaml` (OpenAPI 3.1) | GitHub Release のアセット | `kanban-ios` (swift-openapi-generator), `kanban-android` (OpenAPI Generator) |

## ローカル開発

前提: Node 22+ / pnpm 11+ (corepack 推奨)

```bash
corepack enable pnpm
pnpm install

pnpm typecheck    # 型チェック
pnpm lint         # ESLint
pnpm test         # Vitest
pnpm build        # dist/ に成果物
pnpm openapi:build # openapi.yaml を生成
```

## Zod スキーマから OpenAPI への流れ

```
src/schemas/*.ts     ← Zod スキーマ (エンティティ DTO)
src/api/*.ts         ← Zod スキーマを使った API 操作 (registry に登録)
src/openapi.ts       ← registry → OpenAPI 3.1 ドキュメントを構築
scripts/build-openapi.ts ← openapi.yaml に書き出す (CI で diff 検出)
```

スキーマを追加・変更したら必ず `pnpm openapi:build` を実行し、`openapi.yaml` の差分をコミットする。
CI の `pnpm openapi:check` がこれを検証する。

## バージョニング

- **SemVer に厳格に従う** (この SDK の利用者がいるため)
- 破壊的変更 (フィールド削除・必須化・型変更) は **major bump**
- 互換のあるフィールド追加は **minor**
- バグ修正は **patch**
- リリースは git タグ `v*.*.*` を push すると自動で npm publish + GitHub Release 作成

## このリポの中で使う側になる場合 (consumers のセットアップ)

`.npmrc` に以下を追加し、GitHub Personal Access Token (read:packages) を設定:

```
@kato4b61746f:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm add @kato4b61746f/kanban-contracts
```

## ADR (設計判断の記録)

- [ADR-001 ポリレポ戦略](docs/adr/0001-polyrepo-strategy.md)
- [ADR-002 contracts を独立リポにする理由](docs/adr/0002-contracts-as-source-of-truth.md)

## ドメインドキュメント

- [ドメインモデル](docs/domain.md)
- [ER 図](docs/er.md)
