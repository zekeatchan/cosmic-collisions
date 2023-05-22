import 'phaser';
import Resources from '../config/resources';
import Config from '../config/config';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super(Config.scenes.Preloader);
    }

    preload() {
        document.getElementById("loader").style.display = "none";

        // add logo image
        // this.add.image(Config.scale.centerX, Config.scale.centerY, Resources.image.backgroundMenu.key)
        //     .setDisplaySize(Config.scale.width, Config.scale.height)
        // this.add.image(0, Config.scale.height, Resources.image.backgroundMenuBottom.key)
        //     .setOrigin(0, 1)

        // display progress bar
        var progressBox = this.add.graphics();
        var progressBar = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(0, Config.scale.centerY, Config.scale.width, 40);

        var percentText = this.make.text({
            x: Config.scale.centerX,
            y: Config.scale.centerY + 20,
            text: '0%',
            // style: Config.fonts.instructions
        });
        percentText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xFE0000, 1);
            progressBar.fillRect(0, Config.scale.centerY, Config.scale.width * value, 40);
        });

        // update file progress text
        this.load.on('fileprogress', function (file) {
            // assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            // loadingText.destroy();
            percentText.destroy();
            // assetText.destroy();
            this.time.delayedCall(1000, this.ready, [2], this);
        }.bind(this));


        for (let method in Resources) {
            for (let key in Resources[method]) {
                let args = Resources[method][key].args.slice();
                args.unshift(Resources[method][key].key);
                this.load[method].apply(this.load, args);
            }
        }
    }

    ready() {
            this.scene.launch(Config.scenes.Audio);
            this.scene.start(Config.scenes.Title);
    }
};
