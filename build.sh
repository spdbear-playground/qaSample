# 前回ビルドで作成されたフォルダ群を削除
rm -rf .nuxt public functions/nuxt

# publicフォルダを作成
mkdir public

# Nuxtをビルド
npm run build

# 各種フォルダのコピー
cp -R .nuxt functions/nuxt
cp -R .nuxt/dist/client public/assets
cp -R app/static/+ public/assets