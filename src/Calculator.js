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
            isUpdating: false,
            playerMethod: 0,
            monsterMethod: 0,
            attempts: 1
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

    handleUpdateStats = (creature, i, isPlayer) => {
        if(isPlayer) {
            let newPlayers = [...this.state.players];
            newPlayers[i] = creature;
            this.setState({players: newPlayers})
        } else {
            let newMonsters = [...this.state.monsters];
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

    updating = (isLoading) => {
        this.setState({isUpdating: isLoading})
    }

    render() {
        return(
            <div className="dark-mode">
                <h1>D&amp;D 5e Combat Simulator</h1>
                <div className="grid-container">
                    <div>
                        <button onClick={this.addPlayer}>Add Player</button>
                        {this.state.players.map((_, i) => {
                            return (
                                <Creature 
                                    number={i} 
                                    onUpdateStats={this.handleUpdateStats} 
                                    isPlayer={true}
                                    isUpdating={this.updating}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <button onClick={this.addMonster}>Add Monster</button>
                        {this.state.monsters.map((_, i) => {
                            return (
                                <Creature
                                    number={i}
                                    onUpdateStats={this.handleUpdateStats}
                                    isPlayer={false}
                                    isUpdating={this.updating}
                                />
                            )
                        })}
                    </div>
                </div>
                <div>Pick the combat tactics for the players</div>
                <select value={this.state.playerMethod} onChange={this.handleUpdatePlayerMethod}>
                    <option value={0}>Random order</option>
                    <option value={1}>Weakest first</option>
                    <option value={2}>Strongest first</option>
                </select>
                <div>Pick the combat tactics for the monsters</div>
                <select value={this.state.monsterMethod} onChange={this.handleUpdateMonsterMethod}>
                    <option value={0}>Random order</option>
                    <option value={1}>Weakest first</option>
                    <option value={2}>Strongest first</option>
                </select>
                <div>
                    <div>Number of simulations</div>
                    <input type="number" placeholder={1} onChange={this.handleUpdateAttempts}></input>
                </div>
                <Simulation encounter={this.state}/>
            </div>
        )
    }
}