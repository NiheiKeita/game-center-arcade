#コーディングルール（ディレクトリ構成と責務）フロント

## 2. views ディレクトリ
役割: ページ単位のロジックと表示を担当

構成:

index.tsx: ページ全体のコンポーネント
hooks.ts: ロジック（カスタムフック）を定義
components/: UI部品を切り出す
index.stories.tsx: Storybook カタログ + 必要なUIテスト
hooks.test.ts: hooks.ts のユニットテスト

例: /views/TopView/

```
TopView/
├── index.tsx            // ページコンポーネント
├── hooks.ts             // ロジック（useTopなど）
├── hooks.test.ts        // hooks のユニットテスト
├── index.stories.tsx    // Storybook + UIテスト（defaultはカタログ用）
└── components/
    └── Card/
        └── index.tsx    // UIパーツ（再利用性のある見た目重視のコンポーネント）
```
## 責務のまとめ
場所	役割・責務
views/	ページ単位の処理と画面構成
views/hooks.ts	カスタムフックでロジックを分離
views/components	UIパーツ（見た目のみ。ロジックなし）
hooks.test.ts	フックの単体テスト
index.stories.tsx	Storybook用のUIカタログ + 簡単なUIテスト

## 注意点
default エクスポートの Story にはテストを書かない（カタログ専用）
UI 部品にはロジックを入れず、表示のみに専念
ロジックのテストは hooks.test.ts に分離

# 修正が終わったらやること
以下を実行してエラーがないことを確認してください
```
npm run lint
npm run type-check
```