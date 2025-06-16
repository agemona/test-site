//駒はここへ
let user = {
  name:"user",
  nameJ:"主人公",
  HP: {
    name: "user-hp",
    current: 15
  },
  AT: {
    name: "user-at",
    usual: 70,
    sp: 30
  },
  EV: 25,
  critical: false,
  fumble: false
};

let mage = {
  name:"mage",
  nameJ:"魔法使い",  
  HP: {
    name: "mage-hp",
    current: 12
  },
  AT: {
    name: "mage-at",
    usual: 70,
    sp: 30
  },
  EV: 30,
  critical: false,
  fumble: false
};

let enemy = {
  HP: {
    name: "enemy-hp",
    current: 20
  },
  AT: {
    name: "enemy-at",
    usual: 50,
    sp: 25
  },
  EV: 20,
  critical: false,
  fumble: false
};
