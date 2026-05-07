# ドメインモデル

このドキュメントは kanban プロジェクトのドメイン定義。
変更があれば必ず ER 図 (`er.md`) と Zod スキーマ (`src/schemas/`) も同期させる。

## エンティティ

### User
利用者。`email` でログイン。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| email | string (email) | unique |
| display_name | string | 表示名 |
| avatar_url | string (url) \| null | |
| created_at | datetime | |
| updated_at | datetime | |

### Workspace
Board の入れ物。Trello の Workspace に相当。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| name | string | |
| slug | string | unique, kebab-case |
| owner_id | uuid (User) | |
| created_at | datetime | |
| updated_at | datetime | |

### WorkspaceMembership
User × Workspace の所属と権限。

| フィールド | 型 | 備考 |
|---|---|---|
| workspace_id | uuid (Workspace) | PK (workspace_id, user_id) |
| user_id | uuid (User) | |
| role | enum (owner / admin / member) | |
| joined_at | datetime | |

### Board
Kanban ボード本体。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| workspace_id | uuid (Workspace) | |
| name | string | |
| description | string \| null | |
| background | string \| null | 色コード or 画像 URL |
| visibility | enum (private / workspace / public) | |
| archived_at | datetime \| null | アーカイブ済み判定 |
| created_at | datetime | |
| updated_at | datetime | |

### BoardMembership
User × Board の権限 (Workspace の権限とは別軸で持つ)。

| フィールド | 型 | 備考 |
|---|---|---|
| board_id | uuid (Board) | PK (board_id, user_id) |
| user_id | uuid (User) | |
| role | enum (admin / member / observer) | |
| added_at | datetime | |

### List
ボード内のカラム (Trello の List)。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| board_id | uuid (Board) | |
| name | string | |
| position | string | fractional indexing |
| archived_at | datetime \| null | |
| created_at | datetime | |
| updated_at | datetime | |

### Card
タスク本体。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| list_id | uuid (List) | |
| title | string | |
| description | string \| null | markdown |
| position | string | fractional indexing |
| due_date | datetime \| null | |
| completed_at | datetime \| null | |
| archived_at | datetime \| null | |
| created_by | uuid (User) | |
| created_at | datetime | |
| updated_at | datetime | |

### Label
ボード単位の色付きタグ。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| board_id | uuid (Board) | |
| name | string | |
| color | string | hex `#RRGGBB` |

### CardLabel (中間テーブル)
| フィールド | 型 | 備考 |
|---|---|---|
| card_id | uuid (Card) | PK (card_id, label_id) |
| label_id | uuid (Label) | |

### CardAssignee (中間テーブル)
| フィールド | 型 | 備考 |
|---|---|---|
| card_id | uuid (Card) | PK (card_id, user_id) |
| user_id | uuid (User) | |
| assigned_at | datetime | |
| assigned_by | uuid (User) | |

### Comment
カードへのコメント。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| card_id | uuid (Card) | |
| author_id | uuid (User) | |
| body | string | markdown |
| created_at | datetime | |
| updated_at | datetime | |
| deleted_at | datetime \| null | ソフト削除 |

### Activity
監査ログ的なイベント。

| フィールド | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| workspace_id | uuid (Workspace) | |
| board_id | uuid (Board) \| null | board レベル以下のイベントで埋まる |
| card_id | uuid (Card) \| null | card 関連のイベントで埋まる |
| actor_id | uuid (User) | |
| type | enum (`card.created` / `card.moved` / ...) | |
| payload | jsonb | type ごとに異なる詳細データ |
| created_at | datetime | |

#### Activity.type の候補
- `card.created` / `card.moved` / `card.archived` / `card.completed` / `card.assigned` / `card.labeled`
- `card.commented` / `card.described`
- `list.created` / `list.archived` / `list.renamed`
- `board.created` / `board.member_added` / `board.archived`
- `workspace.member_added`

## 重要な不変条件

- Board は必ず 1 つの Workspace に属する (Workspace を跨がない)
- List は必ず 1 つの Board に属する
- Card は必ず 1 つの List に属する (Board 直下に Card は置けない)
- Label は Board スコープ (Board を跨いで再利用しない)
- Workspace member は所属 Workspace 内の `visibility = workspace` の Board を閲覧可
- `visibility = private` の Board は **BoardMembership** にいるユーザーのみ閲覧可

## 並び順 (position) の方針

List と Card の並び順は **fractional indexing**(文字列ベース) で表現する。
詳細実装は `kanban-api` 側で扱うが、`kanban-contracts` では **`position: string`** とのみ規定する。

## 将来的な追加 (今回は含めない)

- Attachment (S3 連携)
- Checklist / ChecklistItem
- Notification
- PersonalAccessToken (Phase 5 = MCP で必須)
- Webhook
