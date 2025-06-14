//駒はここへ
let user = {
  name:"user",
  nameJ:"主人公",
  HP: {
    name: "user-hp",
    current: 40
  },
  AT: {
    name: "user-at",
    usual: 70,
    sp: 30
  },
  EV: 25
};

let mage = {
  name:"mage",
  nameJ:"魔法使い",  
  HP: {
    name: "mage-hp",
    current: 30
  },
  AT: {
    name: "mage-at",
    usual: 70,
    sp: 30
  },
  EV: 30  
};

let enemy = {
  HP: {
    name: "enemy-hp",
    current: 50
  },
  AT: {
    name: "enemy-at",
    usual: 50,
    sp: 25
  },
  EV: 20
};




//id取り、グローバル変数
const userHp = document.getElementById(user.HP.name);
const mageHp = document.getElementById(mage.HP.name);
const enemyHP = document.getElementById(enemy.HP.name);
const attackBtn = document.getElementById("attack");
const spAttackBtn = document.getElementById("sp-attack");
const evasionBtn = document.getElementById("evasion");
const protectBtn = document.getElementById("protect");
const log = document.getElementById("log");
let turn = 0;//行動順保管
let choiceHP = user;//敵の攻撃対象
let choiceHPnot = mage;//攻撃対象じゃない方
let howAttack = enemy.AT.usual;//攻撃手段



//ダイス
function Dice100 () { 
  let num = Math.floor(Math.random() * 100) + 1;
  console.log(num)
  return num;
};
function Dice6 () { 
  let num = Math.floor(Math.random() * 6) + 1;
  console.log(num)
  return num;
};


btnDisabledEV(true);



//各攻撃
function showLog(className, logs) {//ログを作って見せる。
  const p = document.createElement("p");
  p.classList.add(className); 
  p.textContent = logs;
  log.appendChild(p);
};
function showWin (className) {
  showLog(className,"you win!");
  enemyHP.textContent = 0;
};
function victory (className){
  if (enemy.HP.current <= 0) {
    showWin(className);
    return true;
  };
} ;
function btnDisabledAT (boolean) {
  attackBtn.disabled = boolean;
  spAttackBtn.disabled = boolean;
};
function btnDisabledEV (boolean) {
  evasionBtn.disabled = boolean;
  protectBtn.disabled = boolean;
};



function userAttack(damage) {//主人公
  
  //ログ
  let p = `あなたは敵に${damage}のダメージを与えた！`;
  showLog("user",p);

  //勝利条件
  enemy.HP.current -= damage;
  if (victory("user")) return true;
  

  enemyHP.textContent = enemy.HP.current;

  turn += 1;

  //ボタン無効化
  btnDisabledAT(true);
  return false;
};



function mageAttack(damage) {//魔法使い

  //ログ
  let p = `魔法使いは敵に${damage}のダメージを与えた！`;
  showLog("mage",p);

  //勝利条件
  enemy.HP.current -= damage;
  if (victory("mage")) return true;

  enemyHP.textContent = enemy.HP.current;

  //ターンリセット
  turn = 0;
  return false;
};



//敵の攻撃関係
function enemyAttack1 () {
  if (Math.random() < 0.5) {//攻撃対象
    choiceHP = user;
    choiceHPnot = mage;
    let result = `攻撃対象 ＞ ${choiceHP.nameJ}`;
    showLog("enemy",result);
  }else {
    choiceHP = mage;
    choiceHPnot = user;
    let result = `攻撃対象 ＞ ${choiceHP.nameJ}`;
    showLog("enemy",result);
  };

  if (Math.random() < 0.5) {//攻撃方法
    howAttack = enemy.AT.usual
  }else {
    howAttack = enemy.AT.sp
  };

  const dice = Dice100();
  if (dice <= howAttack) {//攻撃成功時
    let result = `1d100<=${howAttack} ＞ ${dice} ＞ 成功！`;
    showLog("enemy",result);
    btnDisabledEV(false);

    return true;
  }else {//攻撃失敗時
    let result = `1d100<=${howAttack} ＞ ${dice} ＞ 失敗`;
    showLog("enemy",result);
    turn += 1;
    btnDisabledAT(false);

    return false;
  };
};



function lose (choice) {//敗北条件
  if (choice.HP.current <= 0){
    showLog("enemy","you lose!");
    document.getElementById(choice.HP.name).textContent = 0;
    return true;
  };
};
function nextTurn (choice) {
  document.getElementById(choice.HP.name).textContent = choice.HP.current; 

  btnDisabledAT(false);
  turn += 1;
};


function enemyAttack2 () {//かばう
  btnDisabledEV(true);

  let result = `${choiceHPnot.nameJ}は庇った`
  showLog(choiceHPnot.name,result);

  const ATpoint = (howAttack === enemy.AT.usual ? Dice6() : Dice6()+Dice6());
  result = `敵は${choiceHPnot.nameJ}に${ATpoint}のダメージを与えた！`;
  showLog(choiceHPnot.name,result);

  choiceHPnot.HP.current -= ATpoint;
  if (lose(choiceHPnot)) return;//敗北条件

  nextTurn(choiceHPnot);
};

function enemyAttack3 () {//回避
  btnDisabledEV(true);

  showLog(choiceHP.name,"回避判定");

  const dice = Dice100();
  if (dice <= choiceHP.EV) {//回避成功時
    let result = `1d100<=${choiceHP.EV} ＞ ${dice} ＞ 成功`;
    showLog(choiceHP.name,result);    

    btnDisabledAT(false);
    turn += 1;
  }else {//回避失敗時
    let result = `1d100<=${choiceHP.EV} ＞ ${dice} ＞ 失敗`;
    showLog(choiceHP.name,result);  

    const ATpoint = (howAttack === enemy.AT.usual ? Dice6() : Dice6()+Dice6());
    result = `敵は${choiceHP.nameJ}に${ATpoint}のダメージを与えた！`;
    showLog(choiceHP.name,result);

    choiceHP.HP.current -= ATpoint;
    if (lose(choiceHP)) return;//敗北条件

    nextTurn(choiceHP);
  };
};



//各攻撃ボタン
function showATandEV (className){//誰かの「攻撃成功」と敵の「回避判定」
  setTimeout(() => {
    showLog(className.name,"攻撃成功！");
  },500);
  showLogEV("enemy",1000);//回避判定
};

function userFalse(userAt,dice) {
  let result = `1d100<=${userAt} ＞ ${dice} ＞ 失敗`;
  showLog("user",result);

  btnDisabledAT(true);
  turn += 1;
  if (turn === 1) {
    enemyAttack1();
  };        
};

function mageFalse (mageAt,dice) {
  let result = `1d100<=${mageAt} ＞ ${dice} ＞ 失敗`;
  showLog("mage",result);
  
  btnDisabledAT(false);
  turn = 0;        
};

function showLogEV (className,delay = 1000) {//「誰の」回避判定のログを「何秒後」出す
  setTimeout(() => {
    showLog(className, "回避判定");
  }, delay);
}



attackBtn.addEventListener("click", () => {
  const dice = Dice100();
  const dice1 = Dice100();//敵の回避判定用
  btnDisabledAT(true);


  if (turn === 0){
    if(dice <= user.AT.usual){//攻撃成功時

      let result = `1d100<=70 ＞ ${dice} ＞ 成功！`;
      showLog("user",result);

      showLogEV("enemy",1000);//回避判定

      if (dice1 > enemy.EV){//敵の回避失敗時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 失敗`;
          showLog("enemy",result);
        },1500);

        setTimeout(() => {
          if (userAttack(Dice6())) return;
          if (turn === 1) {
            enemyAttack1();
          };        
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 成功`;
          showLog("enemy",result);
        },1500);

        setTimeout (() => {
          btnDisabledAT(true);
          turn += 1;
          if (turn === 1) {
            enemyAttack1();

          };   
        },2000);
      };
    }else{
      userFalse(user.AT.usual,dice);
    };
  }else if (turn === 2){

    if(dice <= mage.AT.usual){//攻撃成功時
      let result = `1d100<=70 ＞ ${dice} ＞ 成功！`;
      showLog("mage",result);

      showLogEV("enemy",1000);//回避判定 

      if (dice1 > enemy.EV) {//敵の回避失敗時

        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 失敗`;
          showLog("enemy",result);
        },1500);

        setTimeout(() => {
          if (mageAttack(Dice6())) return;  
          btnDisabledAT(false);  
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 成功`;
          showLog("enemy",result);

          btnDisabledAT(false);
          turn = 0;
        },1500);
      };
    }else{
      mageFalse(mage.AT.usual,dice);
    };
  };
});



spAttackBtn.addEventListener("click", () => {
  const dice = Dice100();
  const dice1 = Dice100();//敵の回避判定用
  btnDisabledAT(true);
  console.log(turn);


  if (turn === 0){
    
    if(dice <= user.AT.sp){//攻撃成功時

      let result = `1d100<=30 ＞ ${dice} ＞ 成功！`;
      showLog("user",result);

      showLogEV("enemy",1000);//回避判定

      if (dice1 > enemy.EV){//敵の回避失敗時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 失敗`;
          showLog("enemy",result);
        },1500);

        setTimeout(() => {
          if (userAttack(Dice6()+Dice6())) return;
          if (turn === 1) {
            enemyAttack1();
          };        
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 成功`;
          showLog("enemy",result);
        },1500);

        setTimeout (() => {
          btnDisabledAT(true);
          turn += 1;
          if (turn === 1) {
            enemyAttack1();
          };   
        },2000);
      };
    }else{//攻撃失敗時
      userFalse(user.AT.sp,dice);
    };
  }else if (turn === 2){
    
    if(dice <= mage.AT.sp){//攻撃成功時

      let result = `1d100<=30 ＞ ${dice} ＞ 成功！`;
      showLog("mage",result);

      showLogEV("enemy",1000);//回避判定

      if (dice1 > enemy.EV) {//敵の回避失敗時

        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 失敗`;
          showLog("enemy",result);
        },1500);

        setTimeout(() => {
          if (mageAttack(Dice6()+Dice6())) return;  
          btnDisabledAT(false);  
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          result = `1d100<=${enemy.EV} ＞ ${dice1} ＞ 成功`;
          showLog("enemy",result);

          btnDisabledAT(false);
          turn = 0;
        },1500);
      };
    }else{//攻撃失敗時
      mageFalse(mage.AT.sp,dice);
    };
  };
});


evasionBtn.addEventListener("click", () => {
  enemyAttack3()
});
protectBtn.addEventListener("click", () => {
  enemyAttack2()
});









//やったこと：ログ表示、勝利と敗北のログ、オブジェクトにまとめた、ユーザーの攻撃二択、敵の攻撃内容のランダマイズ、,mageの設定、順番、敵の攻撃表示を遅らせる,エネミーの攻撃対象ランダマイズ、敵の攻撃を待ってる間ボタンを無効化,ダイスの概念、攻撃値のダイス化、回避の概念,ココフォリアにログを近づける,回避とかばうの選択化
//やってること：CSSの整え、スピードの概念と順番（発展）,ログの遅延（敵側）、
