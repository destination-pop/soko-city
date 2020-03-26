const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const content = `Ah, you're the stranger looking for their pet chicken?  I'm afraid I can't help you until I solve this mysterious puzzle in my yard!  Could you help??  I would gladly repay you with a random food item!`;

export default class QuestScene extends Phaser.Scene {

  constructor (){
    super('QuestScene');
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

    this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');

    this.load.image('textBox', 'assets/textbox.png')
    
  }

  create () {
    const currentGame = this.scene.get('WorldScene')

    currentGame.events.on('villagerEncounter', function(){
      createTextBox(this, 100, 350, {
        wrapWidth: 400,
        fixedWidth: 400,
        fixedHeight: 65,
      }).start(content, 50);
    }, this)

  }
}

const GetValue = Phaser.Utils.Objects.GetValue;

var createTextBox = function (scene, x, y, config) {
  var wrapWidth = GetValue(config, 'wrapWidth', 0);
  var fixedWidth = GetValue(config, 'fixedWidth', 0);
  var fixedHeight = GetValue(config, 'fixedHeight', 0);
  var textBox = scene.rexUI.add.textBox({
    x: x,
    y: y,

    // background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY).setStrokeStyle(2, COLOR_LIGHT),
    background: scene.add.image(x, y, 'textBox'),

    text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight).setTint(0x260e04),

    action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false).setScale(0.5),

    space: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
      icon: 2,
      text: 10,
    }
  })
  .setOrigin(0)
  .layout();

  textBox
    .setInteractive()

    .on('pointerdown', function () {
      var icon = this.getElement('action').setVisible(false);
      this.resetChildVisibleState(icon);
      if (this.isTyping) {
          this.stop(true);
      } else {
          this.typeNextPage();
      }
    }, textBox)

    .on('pageend', function () {
      if (this.isLastPage) {
        return;
      }

      var icon = this.getElement('action').setVisible(true);
      this.resetChildVisibleState(icon);
      icon.y -= 30;
      var tween = scene.tweens.add({
        targets: icon,
        y: '+=30', // '+=100'
        ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 500,
        repeat: 0, // -1: infinity
        yoyo: false
      });
    }, textBox)
    //.on('type', function () {
    //})

  return textBox;
}


var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.rexUI.add.BBCodeText(0, 0, '', {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: '20px',
    wrap: {
      mode: 'word',
      width: wrapWidth
    },
    maxLines: 3
  })
}

