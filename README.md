このWebアプリは、「予定管理・シフトアプリ」です。<br>
このアプリは、PC/スマホに対応しています。<br>
以下のような要件に基づいて開発を進めました。<br>

1. 基本機能
ユーザー管理<br>

メンバーの登録・認証（Firebase Authentication）<br>
メンバー一覧の表示<br>
各メンバーのプロフィール（名前、役割など）<br>

予定・シフト管理<br>

予定の登録（名前、説明、開始時間、終了時間）<br>
予定の編集・削除（登録者本人のみ）<br>
予定の一覧表示（日別・週別・月別）<br>
稼働状況のリアルタイム表示<br>

表示機能<br>

カレンダービュー（月間・週間・日別）<br>
メンバー別フィルタリング<br>
当日の稼働メンバー一覧<br>
過去の稼働履歴の確認<br>

2. 詳細仕様
予定データ構造<br>
typescriptinterface Schedule {<br>
  id: string;<br>
  userId: string;          // 登録者のID<br>
  userName: string;         // 登録者の名前<br>
  title: string;            // 予定名（例：「オフィス勤務」「リモート」）<br>
  description: string;      // 詳細説明<br>
  startTime: Timestamp;     // 開始時刻<br>
  endTime: Timestamp;       // 終了時刻<br>
  status: 'scheduled' | 'completed' | 'cancelled';<br>
  createdAt: Timestamp;<br>
  updatedAt: Timestamp;<br>
}<br>
ユーザーデータ構造<br>
typescriptinterface User {<br>
  id: string;<br>
  email: string;<br>
  displayName: string;<br>
  role: string;             // 役職・役割<br>
  photoURL?: string;<br>
  createdAt: Timestamp;<br>
}<br>
3. UI/UX設計<br>
主要画面<br>

ダッシュボード: 今日の稼働メンバー、今週の予定概要<br>
カレンダー: 全体の予定が見えるカレンダービュー<br>
メンバー:メンバー一覧の確認<br>
予定登録: モーダルまたは専用ページで予定を登録<br>
履歴: 過去の稼働履歴を確認<br>
プロフィール: ユーザープロフィール管理<br>
