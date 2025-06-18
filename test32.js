//駒とダイスとボタンfalseはtest32(1).jsに移動

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

btnDisabledEV(true);

//各攻撃
function showLog(className, logs) {//「誰の」色で「何を」logで出す
  const p = document.createElement("p");
  p.classList.add(className); 
  p.textContent = logs;
  log.insertBefore(p, log.firstChild);
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
function btnDisabledAT (boolean) {//攻撃ボタンの有無
  attackBtn.disabled = boolean;
  spAttackBtn.disabled = boolean;
};
function btnDisabledEV (boolean) {//回避と庇うボタンの有無
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

  setTimeout (() => {

    if (fumble2(enemy, enemy.name, enemy.EV)) return;

    const dice = Dice100();
    if (dice <= howAttack) {//攻撃成功時
      let result = `1d100<=${howAttack} ＞ ${dice} ＞ 成功！`;
      showLog("enemy",result);
      btnDisabledEV(false);

    }else {//攻撃失敗時
      if (dice >= 95) {//ファンブル処理
        fumble1(enemy,howAttack,dice,"enemy");

        btnDisabledAT(false);
        turn += 1;
      }else {
        let result = `1d100<=${howAttack} ＞ ${dice} ＞ 失敗`;
        showLog("enemy",result);
        turn += 1;
        btnDisabledAT(false);        
      };
    };
  },500);  
};

function lateEnemyAttack () {
  if (turn === 1) {
    setTimeout(() => {
      enemyAttack1();
    },1000);    
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
function falseEV (choiceHP, howAttack) {
  setTimeout(() => {
    const ATpoint = (howAttack === enemy.AT.usual ? Dice6() : Dice6()+Dice6());
    result = `敵は${choiceHP.nameJ}に${ATpoint}のダメージを与えた！`;
    showLog(choiceHP.name,result);

    choiceHP.HP.current -= ATpoint;
    if (lose(choiceHP)) return;//敗北条件

    nextTurn(choiceHP);
  },500);
};



function enemyAttack2 () {//かばう
  btnDisabledEV(true);

  let result = `${choiceHPnot.nameJ}は庇った`
  showLog(choiceHPnot.name,result);

  setTimeout(() => {
    const ATpoint = (howAttack === enemy.AT.usual ? Dice6() : Dice6()+Dice6());
    result = `敵は${choiceHPnot.nameJ}に${ATpoint}のダメージを与えた！`;
    showLog(choiceHPnot.name,result);

    choiceHPnot.HP.current -= ATpoint;
    if (lose(choiceHPnot)) return;//敗北条件

    nextTurn(choiceHPnot);
  },500);
};

function enemyAttack3 () {//回避
  btnDisabledEV(true);

  if (choiceHP.fumble === true) {
    choiceHP.fumble = false;
    let result = `1d100<=${choiceHP.EV} ＞ 自動失敗`
    showLog(choiceHP.name, result);

    falseEV(choiceHP, howAttack);

    return;
  };

  showLogEV(choiceHP.name, 0);


  setTimeout (() => {

    const dice = Dice100();
    if (dice <= choiceHP.EV) {//回避成功時
      let result = `1d100<=${choiceHP.EV} ＞ ${dice} ＞ 成功`;
      showLog(choiceHP.name,result);    

      btnDisabledAT(false);
      turn += 1;
    }else {//回避失敗時

      if (dice >= 95) {//ファンブル処理
        fumble1(choiceHP, choiceHP.AT.sp, dice, choiceHP.name);

        btnDisabledAT(false);
        turn += 1;
      }else {//通常失敗
        let result = `1d100<=${choiceHP.EV} ＞ ${dice} ＞ 失敗`;
        showLog(choiceHP.name,result);  

        falseEV(choiceHP, howAttack);
      };
    };
  },500);
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
  lateEnemyAttack();     
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
};

function showLogDelay (delay, dice, names, res) {
  setTimeout (() => {
    result = `1d100<=${enemy.EV} ＞ ${dice} ＞ ${res}`;
    showLog(names,result);
  },delay)
}

function fumble1 (name, nameAT, dice, names) {//「誰の」と「誰が何をしたら」と「”誰”」ファンブル処理
  name.fumble= true;
  let result = `1d100<=${nameAT} ＞ ${dice} ＞ 致命的失敗`;
  showLog(names,result);
};

function fumble2 (name, whoName, value) {//「誰」と「”誰”」と「値」自動失敗
  if (name.fumble === true) {
    name.fumble = false;

    let result = `1d100<=${value} ＞ 自動失敗`;
    showLog(whoName, result);

    if (name === mage) {
      btnDisabledAT(false);
      turn = 0;
    }else if(name === user){
      turn += 1;
      lateEnemyAttack();
    }else {
      btnDisabledAT(false);
      turn += 1;
    };   
    
    return true;
  };

  return false;
};


attackBtn.addEventListener("click", () => {
  const dice = Dice100();
  const dice1 = Dice100();//敵の回避判定用
  btnDisabledAT(true);


  if (turn === 0){

    if (fumble2(user, user.name, user.AT.usual)) return;

    if(dice <= user.AT.usual){//攻撃成功時

      let result = `1d100<=70 ＞ ${dice} ＞ 成功！`;
      showLog("user",result);

      if (enemy.fumble === true) {//ファンブル処理
        setTimeout(() => {
          enemy.fumble = false;
          showLog("enemy",`1d100<=20 ＞ 自動失敗`); 
          setTimeout(() => {
            if (userAttack(Dice6())) return;
            lateEnemyAttack();    
          },500);
        },1500)
        return;
      };

      showLogEV("enemy",1000);//回避判定


      if (dice1 > enemy.EV){//敵の回避失敗時
        if (dice1 >= 95) {//ファンブル処理
          fumble1(enemy, enemy.EV, dice1, "enemy");
          setTimeout(() => {
            if (userAttack(Dice6())) return;
            lateEnemyAttack();    
          },2000);
        }else {//通常失敗
          showLogDelay(1500, dice1, "enemy", "失敗");

          setTimeout(() => {
            if (userAttack(Dice6())) return;
            lateEnemyAttack();    
          },2000);
        };

      }else {//敵の回避成功時
        showLogDelay(1500, dice1, "enemy", "成功");

        setTimeout (() => {
          btnDisabledAT(true);
          turn += 1;
          lateEnemyAttack(); 
        },2000);
      };
    }else{//攻撃失敗時
      if (dice >= 95) {//ファンブル処理
        fumble1(user, user.AT.usual, dice, "user");

        btnDisabledAT(true);
        turn += 1;
        lateEnemyAttack(); 
      }else {//通常失敗
        userFalse(user.AT.usual,dice);
      };
    };
  }else if (turn === 2){

    if (fumble2(mage, mage.name, mage.AT.usual)) return;

    if(dice <= mage.AT.usual){//攻撃成功時
      let result = `1d100<=70 ＞ ${dice} ＞ 成功！`;
      showLog("mage",result);

      if (enemy.fumble === true) {//ファンブル処理
        setTimeout(() => {
            enemy.fumble = false;
          showLog("enemy",`1d100<=20 ＞ 自動失敗`); 
          setTimeout(() => {
            if (mageAttack(Dice6())) return;
            lateEnemyAttack();    
          },500);
        },1500)
        return;
      };

      showLogEV("enemy",1000);//回避判定 


      if (dice1 > enemy.EV) {//敵の回避失敗時
        showLogDelay(1500, dice1, "enemy", "失敗");

        setTimeout(() => {
          if (mageAttack(Dice6())) return;  
          btnDisabledAT(false);  
        },2000);
      }else {//敵の回避成功時
        showLogDelay(1500, dice1, "enemy", "成功");

        btnDisabledAT(false);
        turn = 0;

      };
    }else{
      if (dice >= 95) {//ファンブル処理
        fumble1(mage, mage.AT.usual, dice, "mage");

        btnDisabledAT(false);
        turn = 0;
      }else {//通常失敗
        mageFalse(mage.AT.usual,dice);
      };
    };
  };
});



spAttackBtn.addEventListener("click", () => {
  const dice = Dice100();
  const dice1 = Dice100();//敵の回避判定用
  btnDisabledAT(true);


  if (turn === 0){
    if (fumble2(user, user.name, user.AT.sp)) return;
    
    if(dice <= user.AT.sp){//攻撃成功時

      let result = `1d100<=30 ＞ ${dice} ＞ 成功！`;
      showLog("user",result);

      if (enemy.fumble === true) {//ファンブル処理
        setTimeout(() => {
            enemy.fumble = false;
          showLog("enemy",`1d100<=20 ＞ 自動失敗`); 
          setTimeout(() => {
            if (userAttack(Dice6()+Dice6())) return;
            lateEnemyAttack();    
          },500);
        },1500)
        return;
      };

      showLogEV("enemy",1000);//回避判定


      if (dice1 > enemy.EV){//敵の回避失敗時
        showLogDelay(1500, dice1, "enemy", "失敗");

        setTimeout(() => {
          if (userAttack(Dice6()+Dice6())) return;
          lateEnemyAttack();      
        },2000);
      }else {//敵の回避成功時
        showLogDelay(1500, dice1, "enemy", "成功");

        setTimeout (() => {
          btnDisabledAT(true);
          turn += 1;
          lateEnemyAttack();   
        },2000);
      };
    }else{//攻撃失敗時
      if (dice >= 95) {//ファンブル処理
        fumble1(user, user.AT.sp, dice, "user");

        btnDisabledAT(true);
        turn += 1;
        lateEnemyAttack(); 
      }else {//通常失敗
        userFalse(user.AT.sp,dice);
      }
    };
  }else if (turn === 2){
    if (fumble2(mage, mage.name, mage.AT.sp)) return;
    
    if(dice <= mage.AT.sp){//攻撃成功時

      let result = `1d100<=30 ＞ ${dice} ＞ 成功！`;
      showLog("mage",result);

      if (enemy.fumble === true) {//ファンブル処理
        setTimeout(() => {
          enemy.fumble = false;
          showLog("enemy",`1d100<=20 ＞ 自動失敗`); 
          setTimeout(() => {
            if (mageAttack(Dice6()+Dice6())) return;
            lateEnemyAttack();    
          },500);
        },1500)
        return;
      };

      showLogEV("enemy",1000);//回避判定


      if (dice1 > enemy.EV) {//敵の回避失敗時
        showLogDelay(1500, dice1, "enemy", "失敗");

        setTimeout(() => {
          if (mageAttack(Dice6()+Dice6())) return;  
          btnDisabledAT(false);  
        },2000);
      }else {//敵の回避成功時
        showLogDelay(1500, dice1, "enemy", "成功");
        
        btnDisabledAT(false);
        turn = 0;        
      };
    }else{//攻撃失敗時
      if (dice >= 95) {//ファンブル処理
        fumble1(mage, mage.AT.sp, dice, "mage");

        btnDisabledAT(false);
        turn = 0;
      }else {//通常失敗
        mageFalse(mage.AT.sp,dice);
      }
    };
  };
});


evasionBtn.addEventListener("click", () => {
  enemyAttack3()
});
protectBtn.addEventListener("click", () => {
  enemyAttack2()
});









//やったこと：ログ表示、勝利と敗北のログ、オブジェクトにまとめた、ユーザーの攻撃二択、敵の攻撃内容のランダマイズ、,mageの設定、順番、敵の攻撃表示を遅らせる,エネミーの攻撃対象ランダマイズ、敵の攻撃を待ってる間ボタンを無効化,ダイスの概念、攻撃値のダイス化、回避の概念,ココフォリアにログを近づける,回避とかばうの選択化,ログの遅延、ファンブル処、、
//やってること：CSSの整え、スピードの概念と順番（発展）,クリファン判定,DEXの概念、敵の回避失敗時のファンブル処理
