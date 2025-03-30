import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private chara!: Phaser.Physics.Arcade.Sprite;

	constructor()
	{
		super('game')
	}

	preload()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        const map = this.make.tilemap({key: 'dungeon'})
        const tileset = map.addTilesetImage('dungeon', 'tiles')

        map.createLayer('Ground', tileset)
        const wallsLayer =  map.createLayer('Walls', tileset)

        wallsLayer.setCollisionByProperty({collides: true})

        const debugGraphics = this.add.graphics().setAlpha(0.7)
        wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(0, 255, 0, 255),
            faceColor: new Phaser.Display.Color(255, 0, 0, 255  )
        })

        this.chara = this.physics.add.sprite(128, 128, 'charTiles', 'charFront.png')

        this.anims.create({
            key:'charFront',
            frames: 'charFront.png'
        })

        this.anims.create({
            key:'charBack',
            frames: 'charBack.png'
        })

        this.anims.create({
            key:'charRight',
            frames: 'charRight.png'
        })

        this.anims.create({
            key:'charLeft',
            frames: 'charLeft.png'
        })

        this.chara.play('charFront')
    }

    update(time: number, delta: number): void {
        if(!this.chara || !this.cursors){return;}

        const speed = 20;

        // left button
        if(this.cursors.left?.isDown) {
            this.chara.play('charLeft')
            this.chara.setVelocity(-speed * delta, 0)
        }

        // right button
        else if(this.cursors.right?.isDown) {
            this.chara.play('charRight')
            this.chara.setVelocity(speed * delta, 0)
        }

        // up button
        else if(this.cursors.up?.isDown) {
            this.chara.play('charBack')
            this.chara.setVelocity(0, -speed * delta)
        }

        // down button
        else if(this.cursors.down?.isDown) {
            this.chara.play('charFront')
            this.chara.setVelocity(0, speed * delta)
        }

        else {
            this.chara.setVelocity(0, 0)
        }
    }
}
