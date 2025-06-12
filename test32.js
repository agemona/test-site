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
      if (dice <= enemy.AT.usual) {//攻撃成功時

        setTimeout(() => {
          showLog("enemy","攻撃成功！");
        },500);
        setTimeout(() => {
          p = String(choice.name);
          showLog(p, "回避判定");
        },1000);
        
        if (Dice100() > choice.EV) {//回避失敗時
          setTimeout(() => {
            showLog(choice.name, "回避失敗");
          },1500);

          return Dice6();
        }else {//回避成功時
          setTimeout(() => {
            showLog(choice.name, "回避成功！");
          },1500);
          return true;
        }
      }else {//攻撃失敗時
        showLog("enemy","失敗！");
        turn += 1;
        return true;
      };
    }else {
      if (dice <= enemy.AT.sp) {//攻撃成功時

        setTimeout(() => {
          showLog("enemy","攻撃成功！");
        },500);
        setTimeout(() => {
          showLog(choice.name, "回避判定");
        },1000);

        
        if (Dice100() > choice.EV) {//回避失敗時
          setTimeout(() => {
            showLog(choice.name, "回避失敗");
          },1500);

          return Dice6()+Dice6();
        }else {//回避成功時
          setTimeout(() => {
            showLog(choice.name, "回避成功！");
          },1500);
          return true;
        }
      }else {//攻撃失敗時

        setTimeout(() => {
          showLog("enemy","失敗！");          
        },1000);

        turn += 1;
        return true;
      };
    };
  };

  const  choiceAT = choiceAttack();

  //ログ
  if (choiceAT !== true) {
    setTimeout(() => {
      //ログ
      const p = `敵は${choice.nameJ}に${choiceAT}のダメージを与えた！`;
      showLog("enemy",p);


      //ダメージ反映
      choice.HP.current -= choiceAT;
      document.getElementById(choice.HP.name).textContent = choice.HP.current;        
    

      //敗北条件
      if (choice.HP.current <= 0) {
        showLog("enemy","you lose!");
        document.getElementById(choice.HP.name).textContent = 0;
        return;
      };

      //ターン増加
      turn += 1;

    },2000);
  }else {
  //ターン増加
  turn += 1;    
  };
};




//各攻撃ボタン
function timeEnemyAttack () {
  setTimeout(() => {
    enemyAttack();

  }, 1000);

  setTimeout(() => {
    btnDisabled(false);    
  },3000);
};



attackBtn.addEventListener("click", () => {
  const dice = 70;
  btnDisabled(true);


  if (turn === 0){
    showLog("user",dice);
    
    if(dice <= user.AT.usual){//攻撃成功時

      setTimeout(() => {
        showLog("user","攻撃成功！");
      },500);
      setTimeout(() => {
        showLog("enemy","回避判定");
      },1000);

      if (Dice100() > enemy.EV){//敵の回避失敗時
        setTimeout(() => {
          showLog("enemy","回避失敗！");
        },1500);

        setTimeout(() => {
          if (userAttack(Dice6())) return;
          if (turn === 1) {
            timeEnemyAttack();
          };        
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          showLog("enemy","回避成功！");
        },1500);

        setTimeout (() => {
          btnDisabled(true);
          turn += 1;
          if (turn === 1) {
            timeEnemyAttack();
          };   
        },2000);
      };

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
    
    if(dice <= mage.AT.usual){//攻撃成功時

      setTimeout(() => {
        showLog("mage","攻撃成功！");
      },500);
      setTimeout(() => {
        showLog("enemy","回避判定");
      },1000);

      if (Dice100() > enemy.EV) {//敵の回避失敗時

        setTimeout(() => {
          showLog("enemy","回避失敗！");
        },1500);

        setTimeout(() => {
          if (mageAttack(Dice6())) return;  
          btnDisabled(false);  
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          showLog("enemy","回避成功！");
          btnDisabled(false);
          turn = 0;
        },1500);
      };
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
    
    if(dice <= user.AT.sp){//攻撃成功時

      setTimeout(() => {
        showLog("user","攻撃成功！");
      },500);
      setTimeout(() => {
        showLog("enemy","回避判定");
      },1000);

      if (Dice100() > enemy.EV){//敵の回避失敗時
        setTimeout(() => {
          showLog("enemy","回避失敗！");
        },1500);

        setTimeout(() => {
          if (userAttack(Dice6()+Dice6())) return;
          if (turn === 1) {
            timeEnemyAttack();
          };        
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          showLog("enemy","回避成功！");
        },1500);

        setTimeout (() => {
          btnDisabled(true);
          turn += 1;
          if (turn === 1) {
            timeEnemyAttack();
          };   
        },2000);
      };

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
    
    if(dice <= mage.AT.sp){//攻撃成功時

      setTimeout(() => {
        showLog("mage","攻撃成功！");
      },500);
      setTimeout(() => {
        showLog("enemy","回避判定");
      },1000);

      if (Dice100() > enemy.EV) {//敵の回避失敗時

        setTimeout(() => {
          showLog("enemy","回避失敗！");
        },1500);

        setTimeout(() => {
          if (mageAttack(Dice6()+Dice6())) return;  
          btnDisabled(false);  
        },2000);
      }else {//敵の回避成功時
        setTimeout(() => {
          showLog("enemy","回避成功！");
          btnDisabled(false);
          turn = 0;
        },1500);
      };
    }else{
      setTimeout(() => {
        showLog("mage","失敗！");
        btnDisabled(false);
        turn = 0;        
      },1000);
    };
  };
});










//やったこと：ログ表示、勝利と敗北のログ、オブジェクトにまとめた、ユーザーの攻撃二択、敵の攻撃内容のランダマイズ、,mageの設定、順番、敵の攻撃表示を遅らせる,エネミーの攻撃対象ランダマイズ、敵の攻撃を待ってる間ボタンを無効化,ダイスの概念、攻撃値のダイス化、回避の概念
//やってること：CSSの整え、スピードの概念と順番（発展）,ログの遅延（敵側失敗表示の遅延が変）、激しく関数化した方がいい。
