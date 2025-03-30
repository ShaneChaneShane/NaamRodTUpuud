import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
	constructor()
	{
		super('game')
	}

	preload()
    {

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

        const charTiles = this.add.sprite(128, 128, 'charTiles', 'charFront.png')
    }
}
