# API 規約

`kanban-contracts` で公開する OpenAPI 操作の命名・パスパターン規約。
新規 API を追加する際は必ず参照する。

## パスパターン: nested for read, flat for mutation

| 操作 | パス | 補足 |
|---|---|---|
| 子リソースの一覧取得 | **nested**: `GET /parents/{id}/children` | スコープを URL で表現、フィルタ込みで自然 |
| 単一リソースの取得 | **flat**: `GET /resources/{id}` | ID は globally unique な前提 |
| 作成 | **flat**: `POST /resources` (parent_id は body) | 作成元のスコープを単純化 |
| 更新 | **flat**: `PATCH /resources/{id}` | |
| 削除 | **flat**: `DELETE /resources/{id}` | |
| サブアクション | **flat**: `POST /resources/{id}/<verb>` | 例: `/cards/{id}/move`, `/cards/{id}/archive` |
| 関連の add/remove | `PUT /resources/{id}/relations/{related_id}` / `DELETE` 同 | 例: card にラベル/担当者を付ける |

例:
- `GET /workspaces/{workspace_id}/boards` (一覧)
- `POST /boards` (workspace_id を body に渡す)
- `GET /boards/{board_id}` (単一取得)
- `POST /boards/{board_id}/archive` (副作用付きの動作)

**理由:** 一覧取得はスコープが URL に出ているほうが直感的だが、作成/更新/削除/副作用は ID
だけで操作できるほうがクライアント側の URL 組み立てがシンプル。Trello / Linear などの
公開 API も同パターン。

## メソッドと冪等性

- **GET**: 副作用なし、キャッシュ可
- **POST**: 作成 or **副作用**を伴うアクション (例: `move`, `archive`)
- **PUT**: 冪等な「ある状態にする」操作 (例: ラベル付与)
- **PATCH**: 部分更新 (差分のみ送る)
- **DELETE**: 削除 (冪等)

## レスポンス

- **2xx**: 成功
  - 200: 取得・更新成功 (body 必須)
  - 201: 作成成功 (作成リソース全体を返す)
  - 204: 成功 + body なし (DELETE / 副作用後で意味のある body がない場合)
- **4xx**: クライアントエラー (`ErrorResponse` を返す、`code` は `SCREAMING_SNAKE`)
  - 400: スキーマ違反
  - 401: 未認証
  - 403: 認可不足
  - 404: 見つからない
  - 409: 競合 (例: slug 重複)
  - 422: 構文は OK だが処理不能 (例: アーカイブ済みリソースに更新)
- **5xx**: サーバ内部エラー (詳細は返さない)

## 認証

- すべての保護リソースは **`BearerAuth`** (HTTP Bearer JWT) を要求
- 認証不要な操作は `/auth/signup`, `/auth/login`, `/auth/refresh` のみ
- `_helpers.ts` の `bearerAuth` を `security` フィールドにそのまま渡す

## 並び順 (position)

- List / Card の `position` は **fractional indexing** の文字列
- `move` / `create` の入力は `after_<resource>_id` を取り、null = 先頭、省略 or なし = 末尾
- `before_<resource>_id` は導入しない (アクション名が片方向で十分明瞭)

## ページング

- カーソルベース (`cursor` + `limit`) を採用、オフセット方式は使わない
- 共通スキーマ `PaginationQuery` を `extend` して各エンドポイントで使う
- レスポンスは現状単純な配列。将来は `{ items, next_cursor }` 形に変更する可能性あり (その時点で major bump)

## 命名

- リソース URL: 複数形 lower_snake (例: `/workspaces`, `/cards`)
- パスパラメータ: snake_case (例: `{workspace_id}`)
- リクエスト/レスポンス body のフィールド: snake_case
- Zod スキーマ名 (TS): PascalCase (`Card`, `CreateCardInput`, `MoveCardInput`)
- API 操作の summary は英語、命令形 (例: "Create a card", "Move a card to another list and/or position")
- tag 名: 複数形 lower_snake (例: `cards`, `lists`)
