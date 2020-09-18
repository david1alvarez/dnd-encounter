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

    runEncounter() {
        let encounter = JSON.parse(JSON.stringify(this.props.encounter));

        let initiativeOrder = []
        encounter.players.forEach(player => {
            initiativeOrder.push({...player, isPlayer: true, initiativeRoll: 0, attackMethod: this.props.encounter.playerMethod})
        })
        encounter.monsters.forEach(monster => {
            initiativeOrder.push({...monster,isPlayer: false, initiativeRoll: 0, attackMethod: this.props.encounter.monsterMethod})
        })

        initiativeOrder.forEach(creature => {
            creature.initiativeRoll = this.rollInitiative(creature)
        })

        initiativeOrder.sort((a, b) => {return (b.initiativeRoll - a.initiativeRoll)})

        // cycle through the initiativeOrder array until one side dies
        let i = 0
        while (initiativeOrder.findIndex(creature => { return (creature.isPlayer && (creature.hp > 0)) }) !== -1
            && initiativeOrder.findIndex(creature => { return (!creature.isPlayer && (creature.hp > 0)) }) !== -1
        ) {
            if (i >= initiativeOrder.length) {
                i = 0
            }
            initiativeOrder = this.attackEnemies(initiativeOrder[i], initiativeOrder)
            i++
        }

        return initiativeOrder
    }

    
    attackEnemies(creature, initiativeOrder) {
        // determine who to attack
        let enemyIndex = 0
        if (creature.attackMethod === 0) { // random order attacks
            let enemyIndices = []
            for (let i=0; i < initiativeOrder.length; i++) {
                if (initiativeOrder[i].isPlayer !== creature.isPlayer) {
                    enemyIndices.push(i)
                }
            }
            if (enemyIndices.length <= 0) {
                console.log('no enemies remaining')
                return initiativeOrder
            }
            enemyIndex = enemyIndices[Math.floor(Math.random() * enemyIndices.length)]
        } else {
            let enemies = []
            for (let i=0; i < initiativeOrder.length; i++) {
                if (initiativeOrder[i].isPlayer !== creature.isPlayer) {
                    enemies.push({index: i, hp: initiativeOrder[i].hp, ac: initiativeOrder[i].ac})
                }
            }
            if (enemies.length <= 0) {
                console.log('no enemies remaining')
                return initiativeOrder
            }
            enemies = this.sortCreatures(creature.attackMethod, enemies)
            enemyIndex = enemies[0].index // getting an "enemies is undefined" error here with weakest first targeting method
        }

        // attack them
        if(this.rollAttack(creature.bonus) >= initiativeOrder[enemyIndex].ac) {
            initiativeOrder[enemyIndex].hp -= this.rollDamage(creature.damage)
        }

        // filter out killed creatures
        if (initiativeOrder[enemyIndex].hp <= 0) {
            initiativeOrder.splice(enemyIndex, 1)
        }
        return initiativeOrder
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
        dice = dice.split(' ').forEach(damageDie => {
            let dice = damageDie.split(/[+d]+/);
            for (let i = 0; i < parseInt(dice[0]); i++) {
                damageDone += parseInt(this.rollDie(dice[1]));
                if(dice.length === 3) {damageDone += parseInt(dice[2]);}
            }
        })
        return damageDone
    }

    rollAttack(bonus) {
        return this.rollDie(20) + bonus
    }

    simulateOutcome = () => {
        let outcomes = []
        for (let i = 0; i < this.props.encounter.attempts; i++) {

            let survivors = this.runEncounter()
            let playersAlive = 0;
            survivors.forEach(creature => {
                if (creature.isPlayer && creature.hp > 0) {
                    playersAlive++
                }
            })

            outcomes.push(this.props.encounter.players.length - playersAlive)
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
                            if (outcome === i) { encounters++; }
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