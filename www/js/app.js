var applicationID = "YOUR_APP_ID";
var sender_id = "SENDER_ID"; //アンドロイド端末のみ

 // 【mBaaS】 APIキーの設定とSDKの初期化


//公開ファイルURL
var publicFileUrl = "https://mb.api.cloud.nifty.com/2013-09-01/applications/" + applicationID + "/publicFiles/";

//現在の端末情報
var currentInstallation;


///// アプリが起動する際に実行されます
$(function() {

    // ボタン処理とメソッドをマッピングします
    $("#LoginBtn").click(onLoginBtn);
    $("#RegisterBtn").click(onRegisterBtn);
    $("#SignupBtn").click(onSignupBtn);
    $("#YesBtn_logout").click(onLogoutBtn);
    $("#FavoriteBtn").click(onFavoriteBtn);
    $("#UpdateFavoriteBtn").click(onUpdateFavoriteBtn);

    // 【mBaaS：プッシュ通知①】デバイストークンの取得し、サーバへ登録処理

});

//----------------------------------会員管理-----------------------------------//
// mBaaSから取得した「User」//現在ログイン中ユーザー情報データ格納用
var currentLoginUser;

// mBaaSから取得した「Shop」クラスのデータ格納用
var shopList;

// mBaaSから取得した「Shop」情報データ格納用（取得しやすくため配列形変更済み）
var shopArray;

//現在詳細ページを表示するお店
var currentShopId;


/* --------- 【mBaaS：会員管理①】会員登録用メールを要求する ------------ */
function onSignupBtn() {
    // 【mBaaS：会員管理①】会員登録用メールを要求する
    var mailaddress = $("#signup_mailaddress").val();
    ncmb.User.requestSignUpEmail(mailaddress)
         .then(function(data){
            // 会員登録用メールの要求成功時の処理
            alert("リクエストを送信しました！メールをご確認ください。");
            $.mobile.changePage('#LoginPage');
         })
         .catch(function(err){
            // 会員登録用メールの要求失敗時の処理
            alert("リクエスト失敗！次のエラー発生: " + err);
           $.mobile.changePage('#LoginPage');
         });
}

/* --------- 【mBaaS：会員管理②】メールアドレスとパスワードでログイン ----------- */
function onLoginBtn()
{
    //【mBaaS：会員管理②】メールアドレスとパスワードでログイン
    // 入力したメールアドレスの値
    var mailaddress = $("#login_mailaddress").val();
    // 入力したパスワードの値
    var password = $("#login_password").val();

    // メールアドレスとパスワードでログイン処理実施
    ncmb.User.loginWithMailAddress(mailaddress, password)
        .then(function(user) {
            // ログイン成功時の処理
            alert("ログイン成功");
            currentLoginUser = ncmb.User.getCurrentUser();
            if(currentLoginUser.nickname) {
                showShopList();
            } else {
                // ユーザ情報登録画面遷移
                $.mobile.changePage('#RegisterPage');
            }
        })
        .catch(function(error) {
            // ログイン失敗時の処理
            alert("ログイン失敗！次のエラー発生: " + error);
        });

}

/* --------- 【mBaaS：会員管理③】ユーザー情報更新----------- */
function onRegisterBtn()
{
    //【mBaaS：会員管理③】ユーザー情報更新-

}


/* --------- 【mBaaS：ファイルストア】Shop画像の取得  ---------- */
// 取得した「Shop」クラスデータからShop画面用の画像名を取得
function showShopDetail(shopId) {
    // 【mBaaS：ファイルストア②】Shop画像の取得

    //ShopPageを表示します
    $.mobile.changePage('#ShopPage');
}

/* --------- 【mBaaS：データストア】Shop一覧の取得  ---------- */
//　mBaaSに登録されているShop情報を取得してリストに表示する
function showShopList() {

    //リストをリセットします。
    $('#listShop').empty();

    //表示名を指定します。
    $("#nickName").text(currentLoginUser.nickname);

    // 【mBaaS：データストア】「Shop」クラスのデータを取得
　　
    $.mobile.changePage('#TopPage');
}


/* --------- 【mBaaS：会員管理④】ユーザー情報の更新  ---------- */
// お気に入りの一覧での「お気に入り更新」ボタン押下時の処理
function onUpdateFavoriteBtn() {
    // 【mBaaS：会員管理④ユーザー情報の更新

}

/* --------- 【mBaaS：会員管理⑤】ユーザー情報の更新  ---------- */
// ショップ詳細ページでの「お気に入り登録」ボタン押下時の処理
function onFavoriteBtn() {
    // 【mBaaS：会員管理⑤】ユーザー情報の更新

}

/* -------------------------- 実装済みメソッド---------------- */
//　mBaaS側のログアウト処理を実施する
function onLogoutBtn()
{
    //ログアウト処理実施
    ncmb.User.logout();

    //ログイン中ユーザをリセット
    currentLoginUser = null;

    //処理結果を表示
    alert('ログアウト成功');

    //ログインページに移動
    $.mobile.changePage('#LoginPage');
}

//　mBaaSにお気に入り登録されているShop情報を取得してリストに表示する
function showFavorite() {

　　//リストをリセットします。
    $("#listFavoriteShop").empty();

    //表示名を指定します。
    $("#favorite_nickName").text(currentLoginUser.nickname + "のお気に入りショップ");

    //お気に入り登録した値を取得
    var fav_shops = currentLoginUser.favorite;

    //ショップ一覧を表示
    for (var i = 0; i < shopArray.length; i++) {
        var shop = shopArray[i];
        var selectStr = "selected='true'";

        //ショップのお気に入りが登録された場合の表示
        var tmpStrOff = "<div class='ui-field-contain'><label for='" + shop.objectId + "'>" + shop.name + "</label><select name='favorite_shop' id='" + shop.objectId + "' data-role='slider' data-theme='e' ><option value='off' " + selectStr+ ">Off</option><option value='" + shop.objectId + "'>On</option></select></div>";

        // //ショップのお気に入りが登録されていない場合の表示
        var tmpStrOn = "<div class='ui-field-contain'><label for='" + shop.objectId + "'>" + shop.name + "</label><select name='favorite_shop' id='" + shop.objectId + "' data-role='slider' data-theme='e' ><option value='off'>Off</option><option value='" + shop.objectId + "' " + selectStr+ " >On</option></select></div>";

        if ($.inArray(shop.objectId, fav_shops) == -1 ){
            $("#listFavoriteShop").append(tmpStrOff);
        }else{
            $("#listFavoriteShop").append(tmpStrOn);
        }
    }

    //Switchスライダーを更新
    $( "select[name=favorite_shop]" ).slider({
        defaults: true
    });
    $('select[name=favorite_shop]').slider('refresh');

    //画面遷移
    $.mobile.changePage('#FavoritePage');
}

//　会員情報を表示する
function showInfoPage() {
    // 各ラベルに値を設定
    $("#info_nickName").text(currentLoginUser.nickname);
    $("#info_gender").text(currentLoginUser.gender);
    $("#info_prefecture").text(currentLoginUser.prefecture);
    $("#info_mailaddress").text(currentLoginUser.mailAddress);

    $.mobile.changePage('#InfoPage');
}

//　ローカルショップリストを変換する
function convertShopList (shops) {
    var shopListTmp = {};
    for (var i = 0; i < shops.length; i++) {
        var shop = shops[i];
        shopListTmp[shop.objectId] = shop;
    }
    return shopListTmp;
}
