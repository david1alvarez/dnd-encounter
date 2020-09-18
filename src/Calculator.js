import React from 'react'
import Creature from './Creature'
import Simulation from './Simulation'
import './Calculator.css'

export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [{}],
            monsters: [{}],
            playerMethod: 0,
            monsterMethod: 0,
            attempts: 1,
            isDevEnvironment: window.location.href.includes('localhost:3000')
        }
        this.addPlayer = this.addPlayer.bind(this)
        this.addMonster = this.addMonster.bind(this)
    }

    addPlayer() {
        let newPlayers = [...this.state.players, []]
        this.setState({players: newPlayers})
    }

    addMonster() {
        let newMonsters = [...this.state.monsters, []]
        this.setState({monsters: newMonsters})
    }

    setTestData = () => {
        let testPlayers = [
            { hp: 20, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 21, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 22, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 23, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 }
        ]
        let testEnemies = [
            { hp: 20, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 21, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 22, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 },
            { hp: 23, ac: 1, bonus: 6, damage: "1d8+3", initiative: 2 }
        ]
        this.setState({players: testPlayers, monsters: testEnemies})
    }

    handleUpdateStats = (creature, i, isPlayer) => {
        if(isPlayer) {
            let newPlayers = [...this.state.players].map(player => {
                return {
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
        this.setState({playerMethod: event.target.value})
    }
    handleUpdateMonsterMethod = (event) => {
        this.setState({monsterMethod: event.target.value})
    }

    handleUpdateAttempts = (event) => {
        this.setState({attempts: event.target.value})
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
                            <button onClick={this.addPlayer}>Add Player</button>
                            {this.state.players.map((player, i) => {
                                return (
                                    <Creature 
                                        key={i}
                                        number={i}
                                        onUpdateStats={this.handleUpdateStats} 
                                        isPlayer={true}
                                        stats={{hp: player.hp, ac: player.ac, bonus: player.bonus, damage: player.damage, initiative: player.initiative}}
                                        onRemoveCreature={this.handleRemoveCreature}
                                        onCopyCreature={this.handleCopyCreature}
                                    />
                                )
                            })}
                        </div>
                        <div>
                            <button onClick={this.addMonster}>Add Monster</button>
                            {this.state.monsters.map((monster, i) => {
                                return (
                                    <Creature
                                        key={i}
                                        number={i}
                                        onUpdateStats={this.handleUpdateStats}
                                        isPlayer={false}
                                        stats={{hp: monster.hp, ac: monster.ac, bonus: monster.bonus, damage: monster.damage, initiative: monster.initiative}}
                                        onRemoveCreature={this.handleRemoveCreature}
                                        onCopyCreature={this.handleCopyCreature}
                                    />
                                )
                            })}
                        </div>
                        {this.state.isDevEnvironment ? <button onClick={this.setTestData}>Add Test Data</button> : ''}
                    </div>
                    <div>Targeting tactics for the players</div>
                    <select className="dropdown" value={this.state.playerMethod} onChange={this.handleUpdatePlayerMethod}>
                        <option value={0}>Random order</option>
                        <option value={1}>Weakest first</option>
                        <option value={2}>Strongest first</option>
                    </select>
                    <div>Targeting tactics for the monsters</div>
                    <select className="dropdown" value={this.state.monsterMethod} onChange={this.handleUpdateMonsterMethod}>
                        <option value={0}>Random order</option>
                        <option value={1}>Weakest first</option>
                        <option value={2}>Strongest first</option>
                    </select>
                    <div>
                        <div>Number of simulations</div>
                        <input type="number" value={this.state.attempts || ''} onChange={this.handleUpdateAttempts}></input>
                    </div>
                    <Simulation encounter={this.state}/>
                </div>
            </div>
        )
    }
}