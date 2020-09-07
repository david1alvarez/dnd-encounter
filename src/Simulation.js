import React from 'react'
import './Simulation.css'

export default class Simulation extends React.Component {
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }

    sortCreatures(method, array) {
        if(method === 0) { // randomized
            return this.shuffleArray(array);
        } else if (method === 1) { // weakest first 
            return array.sort((a, b) => {return (b.ac * b.hp)-(a.ac * a.hp)});
        } else if (method === 2) { // strongest first
            return array.sort((a, b) => {return (a.ac * a.hp)-(b.ac * b.hp)});
        }
    }

    rollInitiative(creature) {
        return this.rollDie(20) + creature.initiative
    }

    runEncounter(monsterMethod, playerMethod) {
        let encounter = JSON.parse(JSON.stringify(this.props.encounter));
        encounter = this.createTargetingOrder(monsterMethod, encounter, true);
        encounter = this.createTargetingOrder(playerMethod, encounter, false)
        let initiativeOrder = []

        encounter.monsters.forEach((monster, index) => {
            let initiative = this.rollInitiative(monster);
            initiativeOrder.push({initiative: initiative, index: index, isPlayer: false})
        })
        encounter.players.forEach((player, index) => {
            let initiative = this.rollInitiative(player);
            initiativeOrder.push({initiative: initiative, index: index, isPlayer: true})
        })

        initiativeOrder.sort((a, b) => {return (a.initiative - b.initiative)})

        initiativeOrder.forEach(turnSlot => {
            if (turnSlot.isPlayer) {
                if(playerMethod === 0) {
                    encounter = this.createTargetingOrder(playerMethod, encounter, false)
                }
                this.monsters = this.attackEnemies(encounter.players[turnSlot.index], encounter.monsters)
            } else {
                if(monsterMethod === 0) {
                    encounter = this.createTargetingOrder(monsterMethod, encounter, true)
                }
                this.players = this.attackEnemies(encounter.monsters[turnSlot.index], encounter.players)
            }
        })
        return encounter
    }

    attackEnemies(creature, enemies) {
        if (creature.hp <= 0) {return enemies}
        let enemyIndex = enemies.findIndex(enemy => enemy.hp > 0);
        if(enemyIndex === -1) {return enemies}


        let attackRoll = this.rollDie(20) + creature.bonus;
        if(attackRoll >= enemies[enemyIndex].ac) {
            let damageDealt = this.rollDamage(creature.damage);
            enemies[enemyIndex].hp = enemies[enemyIndex].hp - damageDealt;
        }
        return enemies
    }

    createTargetingOrder(method, encounter, sortingPlayers) {
        let newEncounter = JSON.parse(JSON.stringify(encounter))
        if (sortingPlayers) {
            newEncounter.players = this.sortCreatures(method, newEncounter.players)
        } else {
            newEncounter.monsters = this.sortCreatures(method, newEncounter.monsters)
        }
        return newEncounter
    }

    rollDie(sides) {
        return Math.floor(Math.random() * Math.floor(sides))+1;
    }

    rollDamage(dice) {
        let damageDone = 0;
        dice.split(' ').forEach(damageDie => {
            let dice = damageDie.split(/[+d]+/);
            for (let i = 0; i < dice[0]; i++) {
                damageDone += this.rollDie(dice[1]);
                if(dice.length === 3) {damageDone += dice[2];}
            }
        })
        return damageDone
    }

    simulateOutcome = () => {
        let outcomes = []
        for (let i = 0; i < this.props.encounter.attempts; i++) {
            let outcome = this.runEncounter(
                            parseInt(this.props.encounter.monsterMethod),
                            parseInt(this.props.encounter.playerMethod)
                            // this.props.encounter.cancel
                        )

            outcome.playersDowned = 0;
            outcome.players.forEach(player => {
                if (player.hp <= 0) {
                    outcome.playersDowned++
                }
            })

            outcomes.push(outcome)
        }
        this.setState({outcomes: outcomes})
    }

    render() {
        return(
            <div>
                <button onClick={this.simulateOutcome}>Run simulation</button>
                {this.showResults}
                {this.state
                    ? Array.apply(0, Array(this.props.encounter.players.length+1)).map((_, i) => {
                        let encounters = 0;
                        this.state.outcomes.forEach(outcome => {
                            if (outcome.playersDowned === i) { encounters++; }
                        })
                        let percentage = (parseFloat(encounters / this.state.outcomes.length) * 100).toFixed(1)
                        return <div key={i}>{i} players die in {encounters} encounters ({percentage}%)</div>
                    })
                    : <div></div>
                }
            </div>
        )
    }
}