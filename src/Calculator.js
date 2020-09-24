import React from 'react'
import Creature from './Creature'
import Simulation from './Simulation'
import './Calculator.css'

/*
    TODO
    create a simple multiattack option where the creature attacks multiple times with the same attack
    create a complex multiattack option where the creature attacks with different attacks

    1. refactor attacks to be an array
    1.1 simple attacks is just copying the original attack multiple times
    1.2 complex attacks has multiple input fields

    2. refactor simulation to use the attacks in the creature's array

    X. add a warning when someone adds a spellcasting enemy that their attack spells need to be added manually
*/

export default class Calculator extends React.Component {
    // add in names and then displays of how frequencly each player dies
    // use monsterData.json, filter in place. 1.6mb is big and may require a loading symbol, but would be worth it.
    constructor(props) {
        super(props);
        this.state = {
            players: [{ name: 'Player 1', hp: '', ac: '', bonus: '', damage: '', initiative: '' }],
            monsters: [{ name: 'Monster 1', hp: '', ac: '', bonus: '', damage: '', initiative: '' }],
            playerMethod: 0,
            monsterMethod: 0,
            attempts: 100,
            isDevEnvironment: window.location.href.includes('localhost:3000')
        }
        this.addPlayer = this.addPlayer.bind(this)
        this.addMonster = this.addMonster.bind(this)
    }

    addPlayer() {
        let newPlayers = [...this.state.players, { name: `Player ${this.state.players.length + 1}`, hp: '', ac: '', bonus: '', damage: '', initiative: '' }]
        this.setState({players: newPlayers})
    }

    addMonster() {
        let newMonsters = [...this.state.monsters, { name: `Monster ${this.state.monsters.length + 1}`, hp: '', ac: '', bonus: '', damage: '', initiative: '' }]
        this.setState({monsters: newMonsters})
    }

    setTestData = () => {
        let testPlayers = [
            { name: "Player 1", hp: 25, ac: 14, bonus: 7, damage: "1d6+3", initiative: 2 },
            { name: "Player 2", hp: 50, ac: 16, bonus: 6, damage: "1d8+3", initiative: 2 },
            { name: "Player 3", hp: 75, ac: 18, bonus: 5, damage: "2d108+3", initiative: 2 },
            { name: "Player 4", hp: 100, ac: 20, bonus: 4, damage: "2d12+3", initiative: 2 }
        ]
        let testEnemies = [
            { name: "Monster 1", hp: 25, ac: 14, bonus: 7, damage: "1d6+3", initiative: 2 },
            { name: "Monster 2", hp: 50, ac: 16, bonus: 6, damage: "1d8+3", initiative: 2 },
            { name: "Monster 3", hp: 75, ac: 18, bonus: 5, damage: "2d10+3", initiative: 2 },
            { name: "Monster 4", hp: 100, ac: 20, bonus: 4, damage: "2d12d6+3", initiative: 2 }
        ]
        this.setState({players: testPlayers, monsters: testEnemies})
    }

    handleUpdateStats = (creature, i, isPlayer) => {
        if(isPlayer) {
            let newPlayers = [...this.state.players].map(player => {
                return {
                    name: player.name,
                    hp: parseInt(player.hp), 
                    ac: parseInt(player.ac), 
                    bonus: parseInt(player.bonus),
                    damage: player.damage,
                    initiative: parseInt(player.initiative)
                }
            });
            
            newPlayers[i] = creature;
            this.setState({players: newPlayers})
        } else {
            let newMonsters = [...this.state.monsters].map(monster => {
                return {
                    name: monster.name,
                    hp: parseInt(monster.hp), 
                    ac: parseInt(monster.ac), 
                    bonus: parseInt(monster.bonus),
                    damage: monster.damage,
                    initiative: parseInt(monster.initiative)
                }
            });
            newMonsters[i] = creature;
            this.setState({monsters: newMonsters})
        }
    }

    handleUpdatePlayerMethod = (event) => {
        this.setState({playerMethod: parseInt(event.target.value)})
    }
    handleUpdateMonsterMethod = (event) => {
        this.setState({monsterMethod: parseInt(event.target.value)})
    }

    handleUpdateAttempts = (event) => {
        this.setState({attempts: parseInt(event.target.value)})
    }

    handleRemoveCreature = (i, isPlayer) => {
        if (isPlayer) {
            let newPlayers = JSON.parse(JSON.stringify(this.state.players))
            newPlayers.splice(i, 1)
            this.setState({players: newPlayers})
        } else {
            let newMonsters = JSON.parse(JSON.stringify(this.state.monsters))
            newMonsters.splice(i, 1)
            this.setState({monsters: newMonsters})
        }
    }

    handleCopyCreature = (i, isPlayer) => {
        if (isPlayer) {
            let newPlayers = JSON.parse(JSON.stringify(this.state.players))
            newPlayers.splice(i, 0, newPlayers[i])
            this.setState({players: newPlayers})
        } else {
            let newMonsters = JSON.parse(JSON.stringify(this.state.monsters))
            newMonsters.splice(i, 0, newMonsters[i])
            this.setState({monsters: newMonsters})
        }
    }

    render() {
        return(
            <div className="dark-mode center">
                <div>
                    <h1 className="center-text">D&amp;D 5e Combat Simulator</h1>
                    <div className="grid-container">
                        <div>
                            {this.state.players.map((player, i) => {
                                return (
                                    <Creature 
                                        key={i}
                                        number={i}
                                        onUpdateStats={this.handleUpdateStats} 
                                        isPlayer={true}
                                        stats={{
                                            name: player.name,
                                            hp: player.hp, 
                                            ac: player.ac, 
                                            bonus: player.bonus, 
                                            damage: player.damage, 
                                            initiative: player.initiative
                                        }}
                                        onRemoveCreature={this.handleRemoveCreature}
                                        onCopyCreature={this.handleCopyCreature}
                                    />
                                )
                            })}
                            <div className="center">
                                <button onClick={this.addPlayer}>Add Player</button>
                            </div>
                        </div>
                        <div>
                            {this.state.monsters.map((monster, i) => {
                                return (
                                    <Creature
                                        key={i}
                                        number={i}
                                        onUpdateStats={this.handleUpdateStats}
                                        isPlayer={false}
                                        stats={{
                                            name: monster.name,
                                            hp: monster.hp, 
                                            ac: monster.ac, 
                                            bonus: monster.bonus, 
                                            damage: monster.damage, 
                                            initiative: monster.initiative

                                        }}
                                        onRemoveCreature={this.handleRemoveCreature}
                                        onCopyCreature={this.handleCopyCreature}
                                    />
                                )
                            })}
                            <div className="center">
                                <button onClick={this.addMonster}>Add Monster</button>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="center">
                        <div>
                            <br/>
                            {this.state.isDevEnvironment ? <button onClick={this.setTestData}>Add Test Data</button> : ''}
                           <div>Targeting tactics for the players</div>
                            <select className="dropdown" value={this.state.playerMethod} onChange={this.handleUpdatePlayerMethod}>
                                <option value={0}>Random order</option>
                                <option value={1}>Defense: weaker first</option>
                                <option value={2}>Defense: stronger first</option>
                                <option value={3}>Offense: weaker first</option>
                                <option value={4}>Offense: stronger first</option>
                                <option value={5}>Combined: weaker first</option>
                                <option value={6}>Combined: stronger first</option>
                            </select>
                            <div>Targeting tactics for the monsters</div>
                            <select className="dropdown" value={this.state.monsterMethod} onChange={this.handleUpdateMonsterMethod}>
                                <option value={0}>Random order</option>
                                <option value={1}>Defense: weaker first</option>
                                <option value={2}>Defense: stronger first</option>
                                <option value={3}>Offense: weaker first</option>
                                <option value={4}>Offense: stronger first</option>
                                <option value={5}>Combined: weaker first</option>
                                <option value={6}>Combined: stronger first</option>
                            </select>
                            <div>
                                <div>Number of simulations</div>
                                <input type="number" value={this.state.attempts || ''} onChange={this.handleUpdateAttempts}></input>
                            </div>
                            <Simulation encounter={this.state}/>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}