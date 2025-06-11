//駒はここへ
let user = {
  name:"主人公",
  HP: {
    name: "user-hp",
    current: 40
  },
  AT: {
    name: "user-at",
    usual: 70,
    sp: 30
  }
};

let mage = {
  name:"魔法使い",
  HP: {
    name: "mage-hp",
    current: 30
  },
  AT: {
    name: "mage-at",
    usual: 70,
    sp: 30
  }
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
  }
};




//id取り
const userHp = document.getElementById(user.HP.name);
const mageHp = document.getElementById(mage.HP.name);
const enemyHP = document.getElementById(enemy.HP.name);
const attackBtn = document.getElementById("attack");
const spAttackBtn = document.getElementById("sp-attack");
const log = document.getElementById("log");

//行動順保管
let turn = 0;

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
function btnDisabled (boolean) {
  attackBtn.disabled = boolean;
  spAttackBtn.disabled = boolean;
};



function userAttack(damage) {//主人公
  
  //ログ
  p = `あなたは敵に${damage}のダメージを与えた！`;
  showLog("user",p);

  //勝利条件
  enemy.HP.current -= damage;
  if (victory("user")) return true;
  

  enemyHP.textContent = enemy.HP.current;

  //ターン増加
  turn += 1;

  //ボタン無効化
  btnDisabled(true);
  return false;
};



function mageAttack(damage) {//魔法使い

  //ログ
  p = `魔法使いは敵に${damage}のダメージを与えた！`;
  showLog("mage",p);

  //勝利条件
  enemy.HP.current -= damage;
  if (victory("mage")) return true;

  enemyHP.textContent = enemy.HP.current;

  //ターンリセット
  turn = 0;
  return false;
};



function enemyAttack () {
  const dice = Dice100();
  showLog("enemy",dice);

  const choice = Math.random() < 0.5 ? user : mage;

  //ランダマイズ
  function choiceAttack () {
    if (Math.random() < 0.5) {
      if (dice <= enemy.AT.usual) {
        return Dice6();
      }else {
        showLog("enemy","失敗！");
        turn += 1;
        return true;
      }
    }else {
      if (dice <= enemy.AT.usual) {
        return Dice6()+Dice6();
      }else {
        showLog("enemy","失敗！");
        turn += 1;
        return true;
      }
    };
  };

  const  choiceAT = choiceAttack();
  if (choiceAT === true) return true

  //ログ
  if (choiceAT !== true) {
    p = `敵は${choice.name}に${choiceAT}のダメージを与えた！`;
    showLog("enemy",p);
  };

  //敗北条件
  choice.HP.current -= choiceAT;
  if (choice.HP.current <= 0) {
    showLog("enemy","you lose!")
    document.getElementById(choice.HP.name).textContent = 0;
    return;
  };

  //ダメージ反映
  document.getElementById(choice.HP.name).textContent = choice.HP.current;

  //ターン増加
  turn += 1;
};




//各攻撃ボタン
function timeEnemyAttack () {
    setTimeout(() => {
    enemyAttack();
    btnDisabled(false);
  }, 1000);
};



attackBtn.addEventListener("click", () => {
  const dice = Dice100();
  btnDisabled(true);


  if (turn === 0){
    showLog("user",dice);
    
    if(dice <= user.AT.usual){
      setTimeout(() => {
        if (userAttack(Dice6())) return;
        if (turn === 1) {
          timeEnemyAttack();
        };        
      },1000);
    }else{
      setTimeout(() => {
        showLog("user","失敗！");
        btnDisabled(true);
        turn += 1;
        if (turn === 1) {
          timeEnemyAttack();
        };        
      },1000);
    };
  }else if (turn === 2){
    showLog("mage",dice);
    
    if(dice <= mage.AT.usual){
      setTimeout(() => {
        if (mageAttack(Dice6())) return;
        btnDisabled(false);
      },1000);
    }else{
      setTimeout(() => {
        showLog("mage","失敗！");
        btnDisabled(false);
        turn = 0;        
      },1000);
    };
  };
});



spAttackBtn.addEventListener("click", () => {
  const dice = Dice100();
  btnDisabled(true);


  if (turn === 0){
    showLog("user",dice);
    
    if(dice <= user.AT.sp){
      setTimeout(() => {
        if (userAttack(Dice6()+Dice6())) return;
        if (turn === 1) {
          timeEnemyAttack();
        };        
      },1000);
    }else{
      setTimeout(() => {
        showLog("user","失敗！");
        btnDisabled(true);
        turn += 1;
        if (turn === 1) {
          timeEnemyAttack();
        };        
      },1000);
    };
  }else if (turn === 2){
    showLog("mage",dice);
    
    if(dice <= mage.AT.sp){
      setTimeout(() => {
        if (mageAttack(Dice6()+Dice6())) return;
        btnDisabled(false);
      },1000);
    }else{
      setTimeout(() => {
        showLog("mage","失敗！");
        btnDisabled(false);
        turn = 0;        
      },1000);
    };
  };
});










//やったこと：ログ表示、勝利と敗北のログ、オブジェクトにまとめた、ユーザーの攻撃二択、敵の攻撃内容のランダマイズ、,mageの設定、順番、敵の攻撃表示を遅らせる,エネミーの攻撃対象ランダマイズ、敵の攻撃を待ってる間ボタンを無効化,ダイスの概念、攻撃値のダイス化
//やってること：CSSの整え、スピードの概念と順番（発展）,回避の概念,ログの遅延(途中 敵側、敵側断念中)、