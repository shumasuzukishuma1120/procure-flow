# 認可ポリシー

## 基本方針

- 1人のユーザーは複数のロールを持つことができる。
- 複数のロールを持つ場合、それぞれのロールに許可された権限を組み合わせて利用できる。
- `ADMIN` は設定・マスタ管理を担当するロールであり、申請・承認・購買処理の権限を自動的には含まない。
- 管理者が業務操作も担当する場合は、`USER`、`APPROVER`、`PURCHASER` のうち必要なロールを別途付与する。
- フロントエンドのメニュー・ボタンの表示制御はUXのために行う。最終的な認可判定はSpring Boot側で行い、権限のないAPI操作を拒否する。

## ロールの責務

| ロール      | 責務 |
| ----------- | ---- |
| `USER`      | 自分の申請の作成、閲覧、編集、提出、取消を行う |
| `APPROVER`  | 承認対象となった申請の閲覧、承認、却下を行う |
| `PURCHASER` | 承認済み申請の発注および受領処理を行う |
| `ADMIN`     | システム設定およびマスタデータを管理する |

## ADMINが管理する対象

`ADMIN`だけが操作できる管理機能として、今後次のCRUDを追加できる設計とする。

- カテゴリマスタ
- 仕入先マスタ

これらの参照が申請入力などの通常業務で必要な場合、参照権限と作成・更新・削除権限は分けて扱う。通常業務のユーザーは参照できるが、マスタを変更できるのは`ADMIN`だけとする。

## 申請者本人に対する認可

`USER`ロールを持っていることに加えて、申請データの所有者本人であることを確認する。

- 一覧・詳細で閲覧できるのは、自分が作成した申請だけとする。
- 下書きの編集・削除・提出ができるのは、作成者本人だけとする。
- 申請中の取消ができるのは、作成者本人だけとする。
- 他人の申請IDをURLやAPIへ直接指定しても、閲覧・操作を許可しない。
- 同じ部署に所属するユーザーであっても、他人の申請は閲覧できない。
- `ADMIN`と`USER`の両方を持つ場合でも、他人の申請を操作する権限は付与されない。

Spring Bootでは、対象となる操作ごとに次の所有者条件を検証する。

```text
request.requesterId == currentUser.id
```

## 承認者に対する認可

`APPROVER`は、自分が所属する部署の申請だけを承認対象として扱う。

- 承認待ち一覧・詳細で扱えるのは、申請者の所属部署が承認者の所属部署と一致する申請だけとする。
- 別部署から提出された申請は、閲覧・承認・却下できない。
- 承認者本人が作成した申請は承認できない。
- 自分の申請は承認待ち一覧の対象から除外する。
- URLやAPIへ申請IDを直接指定した場合も、Spring Boot側で部署と申請者を検証する。
- フロントエンドで対象を非表示にするだけでなく、承認・却下APIでも同じ条件を検証する。

Spring Bootでは、`APPROVER`ロールに加えて次の条件を検証する。

```text
request.requesterDepartmentId == currentUser.departmentId
&& request.requesterId != currentUser.id
```

## 購買担当者に対する認可

`PURCHASER`は全社共通の購買担当者として、部署に関係なく購買対象を扱う。

- 全社の承認済み・発注済み申請を購買処理一覧・詳細で閲覧できる。
- `APPROVED`（承認済み）の申請だけ発注登録できる。
- `ORDERED`（発注済み）の申請だけ受領登録できる。
- その他のステータスは、URLやAPIへ申請IDを直接指定した場合も発注・受領できない。
- 申請者本人が`PURCHASER`を持っている場合も、独立した承認者による承認を通過していれば発注・受領できる。
- フロントエンドのボタン表示だけに依存せず、発注・受領APIでもロールとステータスを検証する。

Spring Bootでは、`PURCHASER`ロールに加えて操作ごとに次の条件を検証する。

```text
発注: request.status == APPROVED
受領: request.status == ORDERED
```

## 認証・認可エラーの扱い

認証状態、ロール、対象データの範囲、業務状態を区別してHTTP Statusを返す。

| 状況 | HTTP Status | 方針 |
| ---- | ----------- | ---- |
| 認証されていない | `401 Unauthorized` | ログインまたはAccess Tokenの更新が必要 |
| 認証済みだが必要なロールを持っていない | `403 Forbidden` | その機能自体を利用する権限がない |
| 必要なロールはあるが、他人・他部署など対象範囲外のデータを指定した | `404 Not Found` | 対象データの存在を権限のない利用者へ知らせない |
| ロールと対象範囲は正しいが、現在のステータスでは操作できない | `409 Conflict` | 最新状態の再取得や業務上のやり直しが必要 |

具体例は次のとおりとする。

```text
USERが他人の申請IDを指定       -> 404 Not Found
APPROVERが別部署の申請を指定  -> 404 Not Found
USERだけを持つ利用者が承認APIを実行 -> 403 Forbidden
発注済みの申請を再度発注       -> 409 Conflict
```

対象範囲外の場合は、データが実際には存在していても`404 Not Found`を返す。これにより、申請IDを推測して他人の申請の存在を調査されることを防ぐ。

## 認可判定の責務分担

認可をフロントエンドの表示制御だけで実現せず、各レイヤーで次の責務を持つ。

### Next.js

- ロールに応じてメニュー、リンク、操作ボタンを表示・非表示にする。
- 権限のないページへの通常の画面遷移を防ぐ。
- APIから返された`401`、`403`、`404`を画面上で適切に扱う。
- Next.js側の制御だけを認可の最終判断にはしない。

### Spring Security

- Access Tokenを検証し、認証済みであることを保証する。
- APIを実行するために必要なロールを持っているか判定する。
- 必要なロールがない場合は、業務処理を実行する前に拒否する。

### Application Service・SQL

- 申請の作成者本人であるか判定する。
- 申請者と承認者が同じ部署であるか判定する。
- 承認者本人が作成した申請ではないことを判定する。
- 一覧取得では、認可対象外のデータを最初から検索結果へ含めない。
- 詳細取得・更新では、対象データの取得条件に認可条件を含めるか、取得後に同等の検証を行う。

### Application Service

- 現在のステータスで要求された操作を実行できるか判定する。
- 状態不整合の場合は`409 Conflict`として扱う。

ロールによる機能単位の認可はSpring Security、所有者・部署などデータ単位の認可はApplication Service・SQL、状態遷移の可否はApplication Serviceが最終的に保証する。

## ユーザー情報とロールの取得元

認証済みユーザーの識別情報とロールはCognito JWT、社内システム固有のユーザー情報はPostgreSQLから取得する。

### Cognito JWT

| Claim | 用途 |
| ----- | ---- |
| `sub` | Cognito上のユーザーを一意に識別する |
| `cognito:groups` | `USER`、`APPROVER`、`PURCHASER`、`ADMIN`のロールとして利用する |

### PostgreSQL `app_users`

| 項目 | 用途 |
| ---- | ---- |
| `cognito_sub` | JWTの`sub`とアプリケーションユーザーを紐付ける |
| 内部ユーザーID | 申請者、承認者、購買担当者などの記録に利用する |
| 部署ID | 所有部署および承認対象部署の判定に利用する |
| 有効状態 | 無効化されたユーザーの利用を拒否する |

次の情報はフロントエンドから送信された値を信用しない。

- 操作ユーザーID
- 操作ユーザーの部署ID
- 操作ユーザーのロール

Spring Bootは検証済みJWTの`sub`と`cognito:groups`、およびPostgreSQLの`app_users`を使用して現在のユーザー情報を構築する。

JWTが有効でも、`sub`に対応する有効なアプリケーションユーザーが存在しない場合は認証済みユーザーとして扱わず、`401 Unauthorized`を返す。

## Access Tokenの中継

ブラウザからSpring Bootを直接呼び出さず、Next.js Route Handlerを経由してAccess Tokenを中継する。

```text
Browser
  -> Next.js Route Handler
  -> Authorization: Bearer <Access Token>
  -> Spring Boot
```

- ブラウザ側の各API関数ではAccess Tokenを手動管理しない。
- ブラウザはNext.jsの同一Origin APIを呼び出す。
- Next.js Route Handlerは、サーバー側セッションからAccess Tokenを取得する。
- Route HandlerはSpring Bootへのリクエストに`Authorization: Bearer <Access Token>`を付与する。
- Spring BootはAccess Tokenの署名、発行者、有効期限およびTokenの用途を検証する。
- APIの認証・認可にはID TokenではなくAccess Tokenを使用する。
- 操作ユーザーID、部署ID、ロールをブラウザから独自Headerとして送信しない。
- Tokenの取得・中継処理は共通化し、各Route Handlerへ認証処理を重複させない。

Next.js側のAPI関数はTokenの保存場所や更新方法を意識せず、Route Handlerが認証済みセッションとSpring Boot APIの境界を担当する。

## ローカル開発環境の認証

ローカル開発でも、固定ユーザーや独自の認証Headerではなく、AWS上に用意した開発用Cognito User Poolを利用する。

- Cognito User PoolとApp Clientは開発環境専用のものを用意する。
- CognitoのCallback URLおよびSign-out URLに`http://localhost`のURLを登録する。
- 開発用ユーザーと`USER`、`APPROVER`、`PURCHASER`、`ADMIN`のCognito Groupを作成する。
- ローカルで起動したNext.jsからCognitoへログインする。
- ローカルで起動したSpring Bootも、Cognitoが発行した実際のAccess Tokenを検証する。
- `local`プロファイルであっても、本来保護されるAPIを`permitAll`にはしない。
- 自動テストでは外部のCognitoへ接続せず、Mock JWT・Mock Authorityを使用する。
- オフライン用の固定認証は現時点では導入せず、必要になった場合に別途検討する。

## Next.jsの認証・セッション管理

Next.jsではAuth.js v5のCognito Providerを使用し、CognitoとのOIDCログインとサーバー側セッションを管理する。

- CognitoのAuthorization Code Flowを使用する。
- Next.js App Routerでは、Server Component・Route HandlerからAuth.jsの`auth()`を使用してセッションを取得する。
- CognitoのAccess TokenはAuth.jsのサーバー側セッションから取得し、Spring Bootへの中継に利用する。
- ブラウザ側の各ComponentやAPI関数ではAccess Tokenを直接管理しない。
- アプリケーションユーザーはPostgreSQLの`app_users`で管理するため、Auth.jsのDatabase Adapterは現時点では導入しない。
- Auth.jsはログインとセッション管理を担当し、業務データに対する最終的な認可判断は担当しない。
- Spring BootはAuth.jsのセッションを信用するのではなく、Cognitoが発行したAccess Tokenを独立して検証する。

Auth.jsを導入しても、XSS、入力検証、API認可、データ単位の認可などが自動的に保証されるわけではない。各レイヤーの責務分担に従って別途対策する。

## 機能別の権限

| 対象                   | USER | APPROVER | PURCHASER | ADMIN |
| ---------------------- | ---: | -------: | --------: | ----: |
| ダッシュボード表示     |    ○ |        ○ |         ○ |     ○ |
| 自分の申請一覧・詳細   |    ○ |          |           |       |
| 下書き作成・編集・削除 |    ○ |          |           |       |
| 申請提出・取消         |    ○ |          |           |       |
| 承認待ち一覧・詳細     |      |        ○ |           |       |
| 承認・却下             |      |        ○ |           |       |
| 購買処理一覧・詳細     |      |          |         ○ |       |
| 発注・受領登録         |      |          |         ○ |       |
| カテゴリ・仕入先の参照 |    ○ |        ○ |         ○ |     ○ |
| カテゴリ・仕入先の作成・更新・削除 |      |          |           |     ○ |
| 設定                   |      |          |           |     ○ |
