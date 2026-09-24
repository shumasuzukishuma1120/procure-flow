# API設計

最終更新: 2026-09-25

## 1. 目的と設計段階

本書は、Next.js BFFとSpring Boot REST APIの責務、主要Endpoint、DTO、認可、競合制御、冪等性を定義する。

本段階では、実装前に変更コストの高いAPI境界と業務ルールを決める。個別DTOの全Field、Idempotency記録の保存期間、Repository実装等は、DB設計と各機能の実装直前に確定する。

## 2. 通信構成と責務

```text
Browser
  ↓ Same Origin / HttpOnly Session Cookie
Next.js BFF
  ↓ Authorization: Bearer <Access Token>
Spring Boot REST API
  ↓
PostgreSQL
```

### Next.js

- ブラウザから受けた検索・更新要求をSpring Bootへ中継する
- サーバー側SessionからAccess Tokenを取得し、Spring BootへのRequestへ付与する
- TokenをブラウザJavaScriptへ公開しない
- URL State、Form State、Query Cache、利用者向けError表示を担当する
- Spring Bootの内部例外や不要な認証情報をブラウザへ転送しない

### Spring Boot

- JWTを検証する
- Role、所有者、担当部門、自己承認禁止、現在状態を組み合わせて最終認可する
- 入力値と業務ルールを検証する
- 正式な合計金額と状態遷移を決定する
- Transaction、楽観ロック、Idempotency、操作履歴を保証する
- PostgreSQLへ保存する

## 3. API共通方針

- Base pathは `/api` とする
- JSONを使用する
- 日時はOffsetを含むISO 8601形式、業務上の日付は `YYYY-MM-DD` とする
- 通貨は日本円のみで、金額は整数として扱う
- Request DTO、Response DTO、Entityを分ける
- Update Requestには利用者が変更できるFieldだけを定義する
- TypeScriptの型やUI制御を最終的なValidation・Authorizationとして扱わない
- 状態を変更するGET Endpointは作らない

## 4. 参照API

認可範囲と検索条件が異なるため、Roleの業務目的ごとに入口を分ける。

```text
GET /api/requests
GET /api/requests/{requestId}

GET /api/approvals
GET /api/approvals/{requestId}

GET /api/purchases
GET /api/purchases/{requestId}
```

| API | 返却範囲 |
| --- | --- |
| `/api/requests` | 認証ユーザー本人の申請だけ |
| `/api/approvals` | 承認者の担当部門内、自己申請を除く承認対象だけ |
| `/api/purchases` | `PURCHASER` が扱える承認済み以降の対象だけ |

API入口は分けるが、重複が確認できた検索処理は内部Service等で共通化できる。入口を1つにして任意の `scope` を渡す方式は、認可分岐漏れの影響が大きいため採用しない。

## 5. 一覧Query

### 共通Parameter

```text
page
size
sort
keyword
```

実際のFilterは一覧用途ごとに定義する。

### 自分の申請一覧

- status
- keyword
- createdFrom / createdTo
- categoryId
- supplierId
- page / size / sort

### 承認待ち一覧

- keyword
- submittedFrom / submittedTo
- departmentId
- categoryId
- minTotalAmount / maxTotalAmount
- page / size / sort

対象statusは常に `SUBMITTED` のため、任意のstatus Parameterは受け取らない。

### 購買対象一覧

- status
- keyword
- departmentId
- supplierId
- approvedFrom / approvedTo
- page / size / sort

## 6. ページングResponse

Spring固有のPage表現をそのまま外部契約にせず、アプリケーション用DTOを返す。

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalElements": 73,
  "totalPages": 4
}
```

- APIの `page` は0始まり、画面表示は1始まりとする
- `size` は20、50、100だけを許可する
- 最大値は100とし、不正値はAPI契約に従って400または既定値へ補正する
- 検索条件適用後の `totalElements` と `totalPages` を返す

## 7. ソート

任意のDB Column名を受け取らず、用途ごとの許可値をEnumまたはホワイトリストで検証する。

例:

```text
UPDATED_DESC
SUBMITTED_ASC
DELIVERY_DATE_ASC
```

Spring Bootは許可値を実際のSortへ変換する。同値時の順序を安定させるため、申請ID等を第2Sort条件へ加える。

フロントでもTypeScriptのUnion型と選択UIを使用するが、Requestは改ざんできるため、Spring Bootで必ず実行時検証する。

## 8. 一覧DTOと詳細DTO

一覧と詳細では目的が異なるため、Response DTOを分ける。

一覧DTOの候補:

```text
MyRequestListItemResponse
ApprovalListItemResponse
PurchaseListItemResponse
```

詳細DTOの候補:

```text
RequestDetailResponse
ApprovalDetailResponse
PurchaseDetailResponse
```

Role別DTOは、実際に項目または意味が異なる場合だけ分ける。名前が違うだけの同一DTOを大量に作らない。

一覧では全明細を返さず、次のような構造化データを返す。

```json
{
  "firstItemName": "ノートPC",
  "additionalItemCount": 2,
  "totalAmount": 320000
}
```

- 合計金額、件数等の業務上の事実はSpring Bootが計算する
- 「ノートPCほか2件」等の表示文言はNext.jsが組み立てる
- 入力中の合計はNext.jsでもPreviewするが、保存時の正式値はSpring Bootが再計算する

## 9. 下書きCRUD

### 作成

```text
POST /api/requests
```

- 新しい `DRAFT` を作成する
- 申請者と下書き時点の申請部門は認証ユーザーから決定する
- DB上のUUIDを発行し、下書きの一意な識別子として返す
- `requestNumber` は正式提出まで `null` とする
- 作成成功時は201と作成後DTOを返す想定とする

### 取得

```text
GET /api/requests/{requestId}
```

本人かつ閲覧可能な申請だけを返す。

### 更新

```text
PUT /api/requests/{requestId}
```

フォーム全体を送信し、現在の下書き内容を置き換える。

Update Requestへ含めるField:

- version
- title
- reason
- desiredDeliveryDate
- requestedSupplierId
- note
- items

Update Requestへ含めないField:

- applicantId
- departmentId
- status
- requestNumber
- createdAt / updatedAt
- totalAmount
- approver / approvedAt

申請者、部門、status等をEntityごとRequestへBindingする方式は、Over-postingやMass Assignmentにつながるため採用しない。

更新成功時は200と更新後の下書きDTOを返す。フロントはResponseでReact Hook Formを `reset` し、dirty状態、サーバー計算値、新しいversionを同期する。

明細は最大20件で、下書き編集履歴と提出前の外部参照を持たないため、更新時は既存の `request_items` を削除し、送信された配列順に `line_number` を付けて再作成する。申請本体のUUIDは維持し、明細UUIDが保存ごとに変わることを許容する。

### 削除

```text
DELETE /api/requests/{requestId}
```

- 本人の `DRAFT` だけを物理削除する
- 成功時は204を返す想定とする
- 提出等が先に確定していた場合は409とする
- DELETEは最終状態が変わらないという意味で冪等だが、初回204、2回目404等、Responseまで同一である必要はない

## 10. 業務操作API

フロントから任意の `status` を指定する汎用更新APIは作らない。権限、入力、遷移条件、履歴が異なるため、業務操作ごとにCommand APIを分ける。

現時点の候補:

```text
POST /api/requests/{requestId}/submit
POST /api/requests/{requestId}/approve
POST /api/requests/{requestId}/reject
POST /api/requests/{requestId}/cancel
POST /api/requests/{requestId}/order
POST /api/requests/{requestId}/complete
```

URLの最終的なResource表現は実装直前に調整できるが、任意status更新を許可せず、Spring Bootが成功した業務操作に応じて状態を決定する原則は維持する。

各Commandは、少なくとも次を確認する。

- 認証ユーザー
- 必要Role
- 所有者または担当部門
- 自己承認禁止
- 現在status
- version
- 操作固有の必須入力
- 仕入先等のMaster有効性
- 操作履歴

状態変更と操作履歴は同一Transactionで保存する。

申請提出時に、Spring Bootは認証Userの現在部門と選択された仕入先Masterを再取得し、部門名・希望仕入先名のSnapshotを確定する。同時にGlobal Sequenceから人向けの申請番号を採番する。UUIDは下書き作成時から変更しない。

## 11. 楽観ロックと409 Conflict

更新Requestには、画面取得時点の `version` を含める。

```json
{
  "version": 3,
  "comment": "内容を確認しました"
}
```

- 最初に状態とversionの更新を確定した操作だけを成功させる
- 古いversionによる更新は409と安定したError Codeを返す
- フロントは同じMutationを自動再送しない
- 詳細APIと関連一覧を再取得する
- 利用者には技術用語ではなく、別のユーザーが更新したことを伝える
- 409 Responseへ最新のDetail DTOを混在させない

`version` は、承認と却下、承認と取消等、異なる利用者・異なる意図の同時更新によるLost Updateを防ぐ。

## 12. Idempotency

MVPでは、少なくとも申請提出で `Idempotency-Key` を実装する。

```text
Idempotency-Key: <client-generated-unique-key>
```

- 同じKeyかつ同じRequest: 保存済みの同じ結果を返す
- 同じKeyで異なるRequest: 409 Conflict
- Timeoutで成否不明の再試行: 同じ内容と同じKeyを使用する
- Timeout後に内容を変更: 新しい業務操作として新しいKeyを使用する

`version` は同時更新の競合を検出し、`Idempotency-Key` は同じ業務操作の重複実行を防ぐ。目的が異なるため、必要な処理では併用する。

承認・発注へIdempotency Keyを展開するかは、MVPの作業時間とRiskを見て判断する。

## 13. Error Response

Problem Detailsを基礎に、安定した業務Error Code、`traceId`、Field Errorを追加する。

```json
{
  "type": "https://example.invalid/problems/request-version-conflict",
  "title": "Request conflict",
  "status": 409,
  "code": "REQUEST_VERSION_CONFLICT",
  "traceId": "...",
  "fieldErrors": []
}
```

| 状況 | Status | フロントの扱い |
| --- | ---: | --- |
| Request形式・Validation不正 | 400 | React Hook FormのFieldへ反映 |
| 未認証・Token問題 | 401 | Token更新、失敗時は再ログイン |
| 権限不足 | 403 | 権限不足画面 |
| 存在しない・閲覧範囲外 | 404 | `not-found.tsx` |
| version・同時更新Conflict | 409 | Dialogで説明し、最新状態を再取得 |
| 業務ルール違反 | 422 | Form上部または操作付近へ表示 |
| 予期しないError | 500 | 内部情報を隠し、Error UIまたはToast |

フロントはMessage文字列ではなく、安定した `code` で処理を分岐する。

## 14. 認証・認可

- Amazon Cognito Managed LoginとAuthorization Code Flow + PKCEを使用する
- BrowserにはHttpOnly、Secure、SameSite属性を持つSession Cookieだけを保持する
- Access Token等はNext.jsのサーバー側Sessionで管理する
- Next.js BFFがSpring BootへAccess Tokenを付与する
- Spring SecurityがAccess Tokenを検証する
- `cognito:groups` を許可済みRoleへホワイトリスト変換する
- Tokenの `sub` とDB Userを対応付ける
- DB Userのactive、所属部門、承認担当部門を認可へ使用する
- UI非表示、Next.jsのRoute保護だけで最終認可を完結させない
- Cookie認証の更新処理にはCSRF対策を行う

## 15. 実装時に決める事項

- Command APIの最終URLとRequest / Response DTO
- Idempotency記録の保存期間、Cleanup、処理中Requestの応答
- Query Parameterの不正値を400にするか安全な既定値へ補正するか
- 一覧検索の実装方法とIndex
- Role別Detail DTOを分ける実益があるか
- BFF Route HandlerとServer ComponentからのAPI Client共有方法
- Access Token更新とSession Storeの具体的なLibrary・保存方式

これらはDB設計と最初の縦方向Sliceを実装する直前に決定する。

DBのTable、Data Type、Constraint、Transaction、Index方針は [DB設計](./db-design.md) を参照する。
