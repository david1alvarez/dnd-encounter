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
        switch(method) {
            case 0: // random
                return this.shuffleArray(array);
            case 1: // weakest defense first
                return array.sort((a, b) => {return (
                    (a.ac * a.hp)-(b.ac * b.hp)
                )});
            case 2: // strongest defense first
                return array.sort((a, b) => {return (
                    (b.ac * b.hp)-(a.ac * a.hp)
                )});
            case 3: // weakest attack first
                return array.sort((a, b) => {return (
                    (a.bonus * this.calculateMaxDamage(a.damage))-(b.bonus * this.calculateMaxDamage(b.damage))
                )})
            case 4: // strongest attack first
                return array.sort((a, b) => {return (
                    (b.bonus * this.calculateMaxDamage(b.damage))-(a.bonus * this.calculateMaxDamage(a.damage))
                )})
            case 5: // weakest combined first
                return array.sort((a, b) => {return (
                    (a.ac * a.hp * a.bonus * this.calculateMaxDamage(a.damage))-(b.ac * b.hp * b.bonus * this.calculateMaxDamage(b.damage))
                )})
            case 6: // strongest combined first
                return array.sort((a, b) => {return (
                    (b.ac * b.hp * b.bonus * this.calculateMaxDamage(b.damage))-(a.ac * a.hp * a.bonus * this.calculateMaxDamage(a.damage))
                )})
            default:
                console.error('no attack case match')
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

        // sort the player and monster targeting orders for non-random targeting cases
        let playerTargetingOrder = [] // ordering of which players the monsters will attack first
        let monsterTargetingOrder = [] // ordering of which monsters the players will attack first
        if (this.props.encounter.monsterMethod !== 0) {
            playerTargetingOrder = this.attackingOrder(this.props.encounter.monsterMethod, false, initiativeOrder)
        }
        if (this.props.encounter.playerMethod !== 0) {
            monsterTargetingOrder = this.attackingOrder(this.props.encounter.playerMethod, true, initiativeOrder)
        }

        // cycle through the initiativeOrder array until one side dies
        let i = 0
        while (initiativeOrder.some(creature => { return (creature.isPlayer && (creature.hp > 0)) })
            && initiativeOrder.some(creature => { return (!creature.isPlayer && (creature.hp > 0)) })
        ) {
            if (i >= initiativeOrder.length) {
                i = 0
            }
            // if the targeting order is random, create the targetingOrders
            if (initiativeOrder[i].isPlayer) {
                if (this.props.encounter.playerMethod === 0) {
                    monsterTargetingOrder = this.attackingOrder(this.props.encounter.playerMethod, initiativeOrder[i].isPlayer, initiativeOrder)
                }
                initiativeOrder = this.attackEnemies(initiativeOrder[i], monsterTargetingOrder, initiativeOrder)
            } else if (!initiativeOrder[i].isPlayer) {
                if (this.props.encounter.monsterMethod === 0) {
                    playerTargetingOrder = this.attackingOrder(this.props.encounter.monsterMethod, initiativeOrder[i].isPlayer, initiativeOrder)
                }
                initiativeOrder = this.attackEnemies(initiativeOrder[i], playerTargetingOrder, initiativeOrder)
            }
            i++
        }

        return initiativeOrder
    }

    attackingOrder(method, isPlayer, initiativeOrder) {
        let enemies = []
        for (let i = 0; i < initiativeOrder.length; i++) {
            if (initiativeOrder[i].isPlayer !== isPlayer) {
                enemies.push({index: i, ...initiativeOrder[i]})
            }
        }
        enemies = this.sortCreatures(method, enemies)
        return enemies
    }

    attackEnemies(creature, enemies, initiativeOrder) {
        // find first alive creature in that targeting order
        let enemy = enemies.find(item => initiativeOrder[item.index].hp > 0)
        if (!enemy) {
            return initiativeOrder
        }

        if ((this.rollAttack(creature.bonus) >= initiativeOrder[enemy.index].ac)) {
            initiativeOrder[enemy.index].hp -= this.rollDamage(creature.damage)
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

    calculateMaxDamage(dice) {
        let maxDamage = 0
        dice.split(' ').forEach(damageDie => {
            let dice = damageDie.split(/[+d]+/);
            maxDamage += (parseInt(dice[0]) * parseInt(dice[1]))
            if (dice.length === 3) {
                maxDamage += parseInt(dice[2])
            }
        })
        return maxDamage
    }

    rollDamage(dice) {
        let damageDone = 0;
        dice.split(' ').forEach(damageDie => {
            let dice = damageDie.split(/[+d]+/);
            for (let i = 0; i < parseInt(dice[0]); i++) {
                damageDone += parseInt(this.rollDie(dice[1]));
            }
            if(dice.length === 3) {damageDone += parseInt(dice[2]);}
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