---
title: 'Laravel + React + InertiaではじめるSPA開発 〜VPSにSSRでデプロイしてみた〜'
description: 'これはLaravel + React + InertiaではじめるSPA開発のチュートリアルです。'
createdAt: '2022-12-05'
img: 'memos/laravel-react-inertia.jpg'
tags: ['Laravel 9', 'React 18', 'Inertia']
type: 'SPA'
icon: 'Laravel'
snippets: [
  { toc: 1, title: 'composerをインストール', slug: 'install-composer'},
  ]
category: 'laravel-react-inertia'
---


## Inertiaとは

Inertia（イナーシャ）とは、Laravel（バックエンド）とReact（フロントエンド）間のデータ連携を解決してくれるJavaScriptライブラリです。従来のLaravel + ReactによるSPA開発では、別途APIを構築する必要がありました。InertiaはWEBルーティングで動作するためAPIが不要です。直訳すると「LaravelのテンプレートエンジンであるBladeをReactで書けちゃう」といったところです。

このチュートリアルでは、ReactとInertia版Reactで何が違うか？にフォーカスしています。そのため、LaravelやReactの基本的な使い方は解説していません。また、本チュートリアルではLaravel/breezeのスターターキットでReactとInertiaをインストールしています。これはZero-config（デフォルト設定で一般的なユースケースに対応できる）を担保し、本チュートリアルの再現性を高めるためです。退屈なインストール作業はスキップしても問題ありませんが、いくつかのオプションを忘れないでください。

```
php artisan breeze:install react --ssr
```

総評してLaravel + React（SPA）を低コスト（VPS）でSSR（OGP対応）したい開発者向けのチュートリアルとなっています。Inertiaの学習コストの低さと、SSRの恩恵をかんがみれば、InertiaはこれからのSPA開発の選択肢のひとつになるでしょう。また、デプロイ先はConohaのVPS（KUSANAGI）を採用しています。KUSANAGIとはチューニング済みのLEMP環境をワンコマンドで構築できる仮想マシンです。たしかにこのスタックはマイナーかも知れません。ただ、LEMP（もしくはLAMP）環境であればデプロイの参考になるかと思います。

React（SPA）でさくっとSSRできる時代がやってきました！それではさっそくはじめましょう！

## 要件
- PHP 8.0^
- Laravel 9.0^
- React 18.2.0

<!-- ::env{envs="[{ 'label': 'DB_NAME', 'value': 'laravel_inertia'}, { 'label': 'DB_NAME', 'value': 'laravel_inertia'} ]"}

:: -->

## Laravelのインストール
<div>
::tab{name1="composer" name2="Laravel sail" slug="laravelsail"}

composerを使ってLaravelをインストールします。

```php
composer create-project laravel/laravel laravel-inertia-react-ssr
```

### MySQLの作成
データベースを作成します。

```nginx
CREATE DATABASE laravel_inertia;
CREATE USER 'laravel_inertia'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON * . * TO 'laravel_inertia'@'localhost';
```
### .envファイルの修正
.envファイルを修正してLaravelとMySQLを接続します。

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_inertia
DB_USERNAME=laravel_inertia
DB_PASSWORD=password
```

### migrateを実行
migrateを実行し、テーブルを作成します。

```php
php artisan migrate
```

### php artisan serveで確認
Laravelの開発サーバーを起動します。

```php
php artisan serve
```

http://localhost:8000にアクセスし、Welcomeページが表示されることを確認してください。

#laravelsail
Laravel SailでLaravelをインストールする。

::
</div>
## laravel/breezeのインストール
laravel/breezeをインストールするときに、–ssrオプションを付けるのを忘れないでください。

```php
composer require laravel/breeze --dev
php artisan breeze:install react --ssr

php artisan migrate
npm install
npm run dev
```

laravel/breezeをインストールすると、Reactのインストールと同時に認証周りのページ、ルートが追加されます。

```
/confirm-password
/forgot-password
/login
/register
/reset-password
/verify-email
```

試しにユーザーを登録してみましょう。ユーザー登録が成功し、dashboardページに遷移したら成功です。後の工程で画像アップロード機能を実装します。ストレージのシンボリックリンクを作成しておきましょう。

```php
php artisan storage:link
```

## Laravelでモデルの作成
ここまで問題なければReactが使える状態です。ReactでCRUD処理を実装する前に、Laravelでモデルを作成していきます。このチュートリアルではItemモデルを例に解説していきます。

### Itemモデルの作成（Laravel）
Itemモデルの作成とmigrationファイルを作成します。

```php
php artisan make:model Item -m
```

migrationファイルを以下のように修正します。

```php
Schema::create('items', function (Blueprint $table) {
  $table->id();
  $table->string('title');
  $table->text('body')->nullable();
  $table->string('image')->nullable();
  $table->foreignId('user_id')->constrained();
  $table->timestamps();
});
```

UserモデルとItemモデルのリレーションを定義します。必要に応じて$fillableも追加します。

app/Models/User.php
```php
public function items()
{
  return $this->hasMany(Item::class);
}
```

app/Models/Item.php
```php
protected $fillable = [
  'title',
  'body',
  'image',
];

protected $appends = [
  'image_fullpath',
];

public function user()
{
  return $this->belongsTo(User::class);
}

public function getImageFullpathAttribute()
{
  return asset('storage/' . $this->image);
}
```

ここまで準備ができたらmigrateを実行します。

```php
php artisan migrate
```

### ItemControllerの作成
ItemControllerを作成します。画像アップロード機能（画像の圧縮、リサイズ等）を実装するので、画像処理の定番パッケージintervention/imageをインストールしておきます。

```php
composer require intervention/image
php artisan make:controller ItemController -r
```

ItemControllerのCRUDを実装していきます。ピュアなLaravelの場合、responseはresponse()->view()関数（MPA）やresponse()->json()関数（SPA）で返却していたかと思います。InertiaではInertia::renderという関数でresponseを返却します。Inertiaクラスをuseするのを忘れないでください。

app/Http/Controllers/ItemController.php
```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Inertia\Inertia;
use App\Models\Item;
use Auth;

...
```

### index()
アイテム一覧ページを表示するためのindex()メソッドを実装します。従来のresponse()->view()関数やresponse()->json()関数の代わりに、Inertia::render関数を使います。第一引数にレンダー先のコンポーネント（ここではresources/js/Pages/Item/Index.jsxをレンダリング）を指定します。第二引数にresponseに含めたいデータを配列で渡します。

app/Http/Controllers/ItemController.php
```php
public function index()
{
  return Inertia::render('Item/Index', [
    'items' => Item::orderByDesc('created_at')->get(),
    'status' => session('status'),
  ]);
}
```

### show()
アイテム詳細ページを表示するためのshow()メソッドを実装します。index()メソッドと同様にInertia::render関数を使います。

app/Http/Controllers/ItemController.php
```php
public function show($id)
{
  return Inertia::render('Item/Show', [
    'item' => Item::findOrFail($id),
    'status' => session('status'),
  ]);
}
```

### create()
アイテム作成ページを表示するためのcreate()メソッドを実装します。index()メソッドと同様にInertia::render関数を使います。

app/Http/Controllers/ItemController.php
```php
public function create()
{
  return Inertia::render('Item/Create', [
    'status' => session('status'),
  ]);
}
```

### edit()
アイテム編集ページを表示するためのedit()メソッドを実装します。index()メソッドと同様にInertia::render関数を使います。

app/Http/Controllers/ItemController.php
```php
public function edit($id)
{
  return Inertia::render('Item/Edit', [
    'item' => Item::findOrFail($id),
    'status' => session('status'),
  ]);
}
```

### store()
アイテムを登録するためのstore()メソッドを実装します。登録完了後、アイテム詳細ページに遷移させたいので、redirect()関数を使います。リダイレクトはInertiaを使いません。

app/Http/Controllers/ItemController.php
```php
public function store(Request $request)
{
  $item = new Item;
  $item->id = uniqid();
  $item->title = $request->title;
  $item->body = $request->body;
  $item->user_id = Auth::id();
  $item->save();

  if ($request->image) {
    $file_name = 'image/items/' . uniqid() . '.jpg';
    $image = \Image::make($request->file('image')->getRealPath())->fit(1200, 627);
    Storage::disk('public')->put($file_name, (string) $image->encode('jpg', 80));

    $item->image = $file_name;
    $item->save();
  }

  return redirect()->route('items.show', [
    'item' => Item::findOrFail($item->id),
    'status' => session('status'),
  ]);
}
```

### update()
アイテムを更新するためのupdate()メソッドを実装します。更新完了後、アイテム詳細ページに遷移させたいので、redirect()関数を使います。

app/Http/Controllers/ItemController.php
```php
public function update(Request $request, $id)
{
  $item = Item::updateOrCreate(
    ['id' => $id, 'user_id' => Auth::id()],
    ['title' => $request->title, 'body' => $request->body]
  );

  if ($request->image) {
    if ($item->image && Storage::disk('public')->exists($item->image)) {
      Storage::disk('public')->delete($item->image);
    }

    $file_name = 'image/items/' . uniqid() . '.jpg';
    $image = \Image::make($request->file('image')->getRealPath())->fit(1200, 627);
    Storage::disk('public')->put($file_name, (string) $image->encode('jpg', 80));

    $item->image = $file_name;
    $item->update();
  }

  return redirect()->route('items.show', [
    'item' => Item::findOrFail($id),
    'status' => session('status'),
  ]);
}
```

### destroy()
アイテムを削除するためのdestroy()メソッドを実装します。削除完了後、アイテム一覧ページに遷移させたいので、redirect()関数を使います。

app/Http/Controllers/ItemController.php
```php
public function destroy($id)
{
  $item = Item::findOrFail($id);

  if ($item->image && Storage::disk('public')->exists($item->image)) {
    Storage::disk('public')->delete($item->image);
  }

  $item->delete();

  return redirect()->route('items.index', [
    'items' => Item::orderByDesc('created_at')->get(),
    'status' => session('status'),
  ]);
}
```

resourcefullでrouteを一括で定義しておきます。

routes/web.php
```php
use App\Http\Controllers\ItemController;

...

Route::resource('items', ItemController::class);
```

これでLaravel側の準備が整いました。React側のCRUD処理を実装していきます。

## Reactで共通のレイアウトを作成
さて、Reactでページコンポーネントを書いていきたいところですが、その前に共通で使うLayoutコンポーネントを作成しましょう。laravel/breeze経由でReactをインストールした場合、デフォルトで2つのLayoutコンポーネントが作成されます。

resources/js/Layouts
AuthenticatedLayout
GuestLayout
Inertiaはデフォルトで認証状況の有無により、2つのLayoutコンポーネントを使い分けています。この設計はときに煩わしいものです。例えば、ユーザーがログインしている状態で、Navbarにユーザー名もしくはアバターを表示させたいときなどです。

このチュートリアルでは新しく、汎用性の高いLayoutコンポーネントを作成することにします。Layoutsディレクトリに新しくLayout.jsxを作成しましょう。

resources/js/Layouts/Layout.jsx
```javascript
export default function Layout({ children }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <main>{children}</main>
    </div>
  );
}
```

新しいTopページを作成
LaravelのデフォルトではWelcomeページが表示されますが、これから作成するTopページが表示されるようにしてみます。web.phpを修正しましょう。

routes/web.php
```php
Route::get('/', function () {
  return Inertia::render('Top', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
  ]);
});
```

Top.jsxを作成します。

resources/Pages/Top.jsx
```javascript
import Layout from '@/Layouts/Layout';

export default function Top() {
  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
}
```

Layoutコンポーネントで囲んだ内容がchildrenとしてLayoutに渡ります。ここまでできたら、http://localhost:8000にアクセスしてみましょう。以下のようにLayoutが適用できたら成功です。


Layoutコンポーネントを適用したTopページ
### Navbar
続いてLayoutコンポーネントで使うNavbarを追加します。

resources/js/Layouts/Navbar.jsx
```javascript
import { Link } from "@inertiajs/inertia-react";

export default function Navbar() {
  return (
    <nav className='bg-white'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        <Link href='/' className='p-4'>Home</Link>
        <div className='flex items-center'>
          <Link href='/item' className='p-4'>Item</Link>
        </div>
      </div>
    </nav>
  );
}
```

ここで使っているLinkコンポーネントはInertiaが提供するコンポーネントです。Linkコンポーネントを使うことでページ遷移時のフルリロードを回避します。

https://inertiajs.com/links

さて認証状況によって表示を切り替えたいときはどうすればよいのでしょう。例えば、ログインしていたらユーザー名を、ログインしていなければログイン画面のリンクを表示したいときです。そんなときはInertiaのグローバルに扱えるデータを使います。

### Inertiaのグローバルデータ
Inertiaはページをレンダリングするとき、グローバルに扱えるデータをセットします。例えば、Controllerで追加したデータの他に、認証情報などのデータがどのページからも参照できると便利かもしれません。これはMiddlewareのHandleInertiaRequests.phpによって実現しています。デフォルトで取得できる値を確認してみましょう。

app/Http/Middleware/HandleInertiaRequests.php
```php
public function share(Request $request)
  {
    return array_merge(parent::share($request), [
      'auth' => [
        'user' => $request->user(),
      ],
      'ziggy' => function () use ($request) {
        return array_merge((new Ziggy)->toArray(), [
          'location' => $request->url(),
        ]);
    },
  ]);
}
```
Controllerで返却するデータと上記Midlewareで設定したデータがマージされてページに返却されます。そのためControllerで追加したデータとMiddlewareで追加したデータがコンフリクトしないように名前をつけてください。またユーザーのパスワード情報など機密性の高い情報は隠すようにと、公式ドキュメントでも言及されています。（デフォルトではUserモデルでpasswordが$hiddenされているので問題ありません。）


デフォルトでセットされるデータは以下です。

compoentnt: pageコンポーネント名
props: データ（Controllerで追加した値やMiddlewareで追加した認証情報など）
url: url
version: アセットのバージョン
さて認証状況によってNavbarの表示を切り替えてみましょう。ピュアなReactではStore（Redux）を検討する局面かもしれません。InertiaではusePage()関数を使い、グローバルデータからユーザー情報を取得します。


NavbarコンポーネントでusePage().propsでauthデータを受け取ります。受け取ったauthデータをもとに表示内容を分岐させます。

resources/js/Layouts/Navbar.jsx
```javascript
import { Link, usePage } from "@inertiajs/inertia-react";

export default function Navbar() {
  const { auth } = usePage().props;

  return (
    <nav className='bg-white'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        <Link href='/' className='p-4'>Home</Link>
        <div className='flex items-center'>
          <Link href='/item' className='p-4'>Item</Link>
            {auth.user ?
              <Link href='/profile' className='p-4'>{auth.user.name}</Link>
            :
              <Link href='/login' className='p-4'>Login</Link>
            }
        </div>
      </div>
    </nav>
  );
}
```

明示的にusePage().propsからauthデータを取得しましたが、以下のように分割代入で取得することも可能です。

```javascript
import { Link, usePage } from "@inertiajs/inertia-react";

export default function Navbar({ auth }) {
  return (
    <nav className='bg-white'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        <Link href='/' className='p-4'>Home</Link>
        <div className='flex items-center'>
          <Link href='/item' className='p-4'>Item</Link>
            {auth.user ?
              <Link href='/profile' className='p-4'>{auth.user.name}</Link>
            :
              <Link href='/login' className='p-4'>Login</Link>
            }
        </div>
      </div>
    </nav>
  );
}
```

デフォルトではresources/js/app.jsxでグローバルデータを分割代入しているからです。

```javascript
createInertiaApp({
    ...

    root.render(<App {...props} />);
  },
});
```

ログインした状態でユーザー名が表示されれば成功です。


## metaタグを動的に変更する
Inertiaを採用する最もな理由はReact（SPA）をSSRさせたい（OGP対応）からかもしれません。metaタグを動的に変更する方法を学びましょう。

### metaタグを設定するHeadコンポーネント
Inertiaにはmetaタグを動的に変更するためのHeadコンポーネントが用意されています。実際にTopページのmetaタグを変更してみましょう。最も簡単な方法は、ページごとにmetaタグを設定することです。Headコンポーネントで囲んだmetaタグがheadタグに追加されます。

resources/js/Pages/Top.jsx
```javascript
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/inertia-react';

export default function Top(props) {
  return (
    <Layout auth={props.auth}>
      <Head>
        <title>Laravel + Inertia + ReactでCRUDアプリ（SSR）をつくろう</title>
        <meta name='description' content='Laravel + Inertia + ReactでCRUDアプリ（SSR）をつくるチュートリアルです。' />
      </Head>

      <h1>Home</h1>
    </Layout>
  );
}
```

私たちがしたいことはこんなことではありません。ページごとにmetaタグを一つ一つ設定する作業は退屈です。TwitterのOGPタグって何個あると思っているの？そこで、新しくAppHeadコンポーネントを作成し、この悩みを解決しましょう。

resources/js/Layouts/AppHead.jsx
```javascript
import { Head, usePage } from "@inertiajs/inertia-react";

export default function AppHead({ title, desc, image }) {
  const { ziggy } = usePage().props;

  return (
    <Head>
      <title head-key='title'>{title}</title>
      <meta head-key='description' name='description' content={desc} />
      <meta head-key='ogTitle' property='og:title' content={title} />
      <meta head-key='ogDescription' property='og:description' content={desc} />
      <meta head-key='ogUrl' property='og:url' content={ziggy.location} />
      <meta head-key='ogType' property='og:type' content='article' />
      <meta head-key='ogImage' property='og:image' content={image} />
      <meta head-key='ogSiteName' property='og:site_name' content='YOUR_SITE_NAME' />

      {/* Twitter */}
      <meta head-key='twitterSite' name='twitter:site' content='@YOUR_TWITTER' />
      <meta head-key='twitterCard' name='twitter:card' content='summary_large_image' />
      <meta head-key='twitterDomain' name='twitter:domain' content='YOUR_DOMAIN' />
      <meta head-key='twitterTitle' name='twitter:title' content={title} />
      <meta head-key='twitterImage' name='twitter:image' content={image} />
      <meta head-key='twitterDescription' name='twitter:description' content={desc} />
    </Head>
  );
}
```

わずか3個のprops（title, desc, image）を定義するだけで、14個のmetaタグが生成されます！head-keyで一意のプロパティを指定することで、metaタグが重複せずに追加されます。AppHeadコンポーネントを使ってTopページを修正しましょう。

resources/js/Pages/Top.jsx
```javascript
import AppHead from '@/Layouts/AppHead';
import Layout from '@/Layouts/Layout';

export default function Top() {
  return (
    <Layout>
      <AppHead
        title='Laravel + Inertia + Reactチュートリアル'
        desc='Laravel + Inertia + ReactでCRUDアプリ（SSR）をつくるチュートリアルです。'
        image=''
      />

      <h1>Home</h1>
    </Layout>
  );
}
```

ようやく準備が整いました。いよいよReactでCRUD処理を実装していきます。

## ReactでCRUDを実装
route定義はPagesディレクトリで
Inertiaのroute定義はNext.jsのようにPagesディレクトリで解決します。Pagesディレクトリ配下にItemディレクトリを作成します。laravel/breezeでReactをインストールすると、デフォルトでTailwindcssもインストールされます。わたしはあなたのCSSに対する偏愛に干渉するつもりはありません。

### アイテム一覧ページ Index.jsx
ReactコンポーネントでLaravelのレスポンスを参照するにはpropsを受け取ります。propsの中にはauthなど他のデータも含まれますが、ここでは分割代入でitems（ItemControllerのindex()で追加したデータ）のみ取得しています。

resources/js/Pages/Item/Index.jsx
```javascript
import AppHead from "@/Layouts/AppHead";
import Layout from "@/Layouts/Layout";
import { Link } from "@inertiajs/inertia-react";

export default function ItemIndex({ items }) {
  return (
    <Layout>
      <AppHead
        title='アイテム一覧'
        desc='アイテム一覧ページです。'
        image={items[0] && items[0].image_fullpath}
      />

      <div>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-lg font-bold'>Items</h1>
          <Link href='/items/create' className='bg-blue-500 text-white py-2 px-4 text-sm'>Create</Link>
        </div>
        <div>
          {items.map((item) => (
            <div key={item.id} className='relative'>
              <Link href={`/items/${item.id}`} className='absolute top-0 left-0 w-full h-full' />
              <img
                src={item.image_fullpath}
                alt={item.title}
              />
              <h2 className='font-bold'>{item.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

### アイテム作成ページ Create.jsx
ReactからLaravelにPOSTリクエストを送る方法を確認しましょう。従来のLaravel（API）とReact間の通信はaxiosなどのHTTPクライアントを使うことが一般的でした。Laravelはaxiosを内包していますが、Inertia版ReactではInertiaクラスでリクエストを送ります。そしてuseStateの代わりに、useForm関数を使っていることに注目してください。

画像などのファイルアップロードを伴うPOSTリクエストもuseFormのpostメソッドを使います。input type=’file’にvalue属性がないことに気をつけてください。

resources/js/Pages/Item/Create.jsx
```javascript
import AppHead from "@/Layouts/AppHead";
import Layout from "@/Layouts/Layout";
import { Link, useForm } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";

export default function ItemCreate() {
  const { data, setData, post } = useForm({
    title: '',
    body: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChangeFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0]);
    setData('image', e.target.files[0]);
  };

  const submit = (e) => {
    e.preventDefault();
    post('/items');
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile]);

  return (
    <Layout>
      <AppHead
        title='アイテム作成'
        desc='アイテム作成のページです。'
        image=''
      />

      <div>
        <h1 className='text-md font-bold'>Item Create</h1>
        <form onSubmit={submit}>
          <div className='flex flex-col my-4'>
            <label htmlFor='title'>title</label>
            <input
              id='title'
              type='text'
              value={data.title}
              className='w-full rounded-md'
              onChange={(e) => setData('title', e.target.value)}
            />
          </div>
          <div className='flex flex-col my-4'>
            <label htmlFor='body'>body</label>
            <textarea
              id='body'
              rows={4}
              value={data.body}
              className='w-full rounded-md'
              onChange={(e) => setData('body', e.target.value)}
            ></textarea>
          </div>
          <div className='flex flex-col my-4'>
            <label htmlFor='image'>image</label>
            <input
              id='image'
              type='file'
              onChange={(e) => handleChangeFile(e)}
            />
          </div>
          {selectedFile && <img src={preview} alt='preview' className='my-4' />}
          <div>
            <Link href='/items' className='py-2 px-4 mr-4'>Back</Link>
            <button type='submit' className='py-2 px-4 bg-gray-800 text-white'>Submit</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
```

### アイテム詳細ページ Show.jsx
ここでは分割代入でitem（ItemControllerのshow()で追加したデータ）とauthを取り出しています。認証状況と作成者から、修正、削除可能か分岐させています。アイテム削除ページは作成せず、ボタン経由でDELETEリクエストを送信します。Inertia.delete(`/items/${item.id}`);

resources/js/Pages/Item/Show.jsx
```javascript
import AppHead from "@/Layouts/AppHead";
import Layout from "@/Layouts/Layout";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";

export default function ItemShow({ item, auth }) {
  const handleDestroy = () => {
    Inertia.delete(`/items/${item.id}`);
  };

  return (
    <Layout>
      <AppHead
        title={`${item.title}の詳細`}
        desc={`${item.title}の詳細ページです。`}
        image={item.image_fullpath}
      />

      <div>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-xl font-bold mb-2'>{item.title}</h1>
          {auth.user && item.user_id === auth.user.id && (
            <div className=''>
              <Link href={`/items/${item.id}/edit`} className='inline-block py-2 px-4 mr-4 text-sm bg-blue-500 text-white'>Edit</Link>
              <button onClick={handleDestroy}  className='py-2 px-4 bg-red-500 text-white text-sm'>Delete</button>
            </div>
          )}
        </div>
        <img
          src={item.image_fullpath}
          alt={item.title}
        />
        <p className='my-4'>{item.body}</p>
        <Link href='/items' className='inilne-block py-2 px-4 mt-4 bg-gray-800 text-white'>Back</Link>
      </div>
    </Layout>
  );
}
```

### アイテム編集ページ Edit.jsx
ReactからLaravelにPUTリクエストを送る方法を確認しましょう。Create.jsxと動作は似ていますが、使う関数が違うことに注意してください。Create.jsxではuseFormのpostメソッドを使いましたが、画像をアップロードする場合、Inertiaクラスのpostメソッドを使います。さらにputメソッドに変更することでPUTリクエストを実装しています。

resources/js/Pages/Item/Edit.jsx
```javascript
import AppHead from "@/Layouts/AppHead";
import Layout from "@/Layouts/Layout";
import { Inertia } from "@inertiajs/inertia";
import { Link, useForm } from "@inertiajs/inertia-react";

export default function ItemEdit({ item }) {
  const { data, setData } = useForm({
    title: item.title,
    body: item.body,
    image: item.image,
  });

  const submit = (e) => {
    e.preventDefault();
    const tmp = { title: data.title, body: data.body }
    const formData = item.image !== data.image ? { ...tmp, image: data.image } : {...tmp}

    Inertia.post(`/items/${item.id}`, {
      _method: 'put',
      ...formData,
    });
  };

  return (
    <Layout>
      <AppHead
        title='アイテム編集'
        desc='アイテム編集のページです。'
        image=''
      />

      <div>
        <h1 className='text-md font-bold'>Item Edit</h1>
        <form onSubmit={submit}>
          <div className='flex flex-col my-4'>
            <label htmlFor='title'>title</label>
            <input
              id='title'
              type='text'
              value={data.title}
              className='w-full rounded-md'
              onChange={(e) => setData('title', e.target.value)}
            />
          </div>
          <div className='flex flex-col my-4'>
            <label htmlFor='body'>body</label>
            <textarea
              id='body'
              rows={4}
              value={data.body}
              className='w-full rounded-md'
              onChange={(e) => setData('body', e.target.value)}
            ></textarea>
          </div>
          <div className='flex flex-col my-4'>
            <label htmlFor='image'>image</label>
            <input
              id='image'
              type='file'
              onChange={(e) => setData('image', e.target.files[0])}
            />
            {item.image_fullpath && <img src={item.image_fullpath} alt={item.title} className='my-4' />}
          </div>
          <div>
            <Link href='/items' className='py-2 px-4 mr-4'>Back</Link>
            <button type='submit' className='py-2 px-4 bg-gray-800 text-white'>Submit</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
```

さて、これで一通りReact側のCRUDが実装できました。さっそく本番環境にデプロイしてみましょう。本当にSSR（OGP）できているのでしょうか？

## VPSにデプロイ
### DNSの設定
KUSANAGIをプロビジョニング（配置）する前に、お手元のドメインのDNSを設定しておく必要があります。

### KUSANAGIのプロビジョニング
このチュートリアルではLEMPの構築にKUSANAGI 9を使っています。KUSANAGI 8とはコマンドが異なるので注意してください。ターミナルからsshでVPSに接続し、プロビジョニングを行います。

rootユーザーで実行

```nginx
kusanagi provision --lamp --fqdn YOUR_DOMAIN --email YOUR_EMAIL --dbname YOUR_DB_NAME --dbuser YOUR_DB_USER --dbpass YOUR_DB_PASSWORD YOUR_PROFILE
```

作成したプロファイルに移動してgitからcloneしましょう。例として、ここではrepoディレクトリにcloneしています。

kusanagiユーザーで実行

```nginx
git clone git@github.com:kiyoshion/laravel-inertia-react-ssr.git repo
```

cloneしたrepoディレクトリに移動し、.envファイルを修正します。

```nginx
cd repo
cp .env.example .env
```

プロビジョニングで設定した内容など書き換えます。

```php
APP_NAME=Laravel
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=YOUR_DOMEIN

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=YOUR_DB_NAME
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
```

まだcloneしただけなので、必要なパッケージがインストールされていません。composerとnpmで必要なパッケージをインストールします。

```nginx
composer install
npm install
```
Laravelの初期設定で必要なコマンドを実行します。

```nginx
php artisan key:generate
php artisan storage:link
chmod -R 777 storage bootstrap/cache
php artisan migrate
php artisan config:clear
php artisan config:cache
```

Nginxのconfファイルを変更します。rootをDocumentRootからrepo/publicに変更します。

```nginx
vim /etc/opt/kusanagi/nginx/conf.d/YOUR_PROFILE.conf
server {
  listen 80;
  ...

  root /home/kusanagi/laravel_inertia/repo/public;
}

server {
  listen 443 ssl http2;
  ...

  root /home/kusanagi/laravel_inertia/repo/public;
}
```

```nginx
kusanagi restart
```

npm run buildでbuildファイルを生成します。

```nginx
npm run build
```

pm2でSSRのプロセスをデーモン化（永続化）します。foreverなどもありますがpm2の方が新しいのでこちらにしました。

```nginx
npm install -g pm2
pm2 start bootstrap/ssr/ssr.mjs --name inertia_test -i 1
pm2 list
```

お疲れさまでした！デプロイ先のドメインにアクセスしてみましょう。

