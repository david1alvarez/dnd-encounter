import React from 'react'

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

    createEncounterOrder(method, encounter, isPlayersTurn) {
        let newEncounter = JSON.parse(JSON.stringify(encounter))
        if (isPlayersTurn) {
            newEncounter.monsters = this.sortCreatures(method, newEncounter.monsters)
        } else {
            newEncounter.players = this.sortCreatures(method, newEncounter.players)
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

    attackEnemies(creatures, enemies) {
        creatures.forEach(creature => {
            if (creature.hp <= 0) {return}
            let enemyIndex = enemies.findIndex(enemy => enemy.hp > 0);
            if(enemyIndex === -1) {return}
            let attackRoll = this.rollDie(20) + creature.bonus;
            if(attackRoll >= enemies[enemyIndex].ac) {
                let damageDealt = this.rollDamage(creature.damage);
                enemies[enemyIndex].hp = enemies[enemyIndex].hp - damageDealt;
            }
        })
        return enemies
    }

    runEncounter(monsterMethod, playerMethod, cancel) {
        // we need to deep copy the object here with JSON.parse(JSON.Stringify(obj)). 
        // Object.assign() is shallow copy, and sub-surface-level parameters will 
        // still point to the original object's parameters
        let encounter = JSON.parse(JSON.stringify(this.props.encounter));
        encounter = this.createEncounterOrder(monsterMethod, encounter, false);
        encounter = this.createEncounterOrder(playerMethod, encounter, true)
        let turn = 1;

        while(!cancel
            && turn < 400
            && encounter.monsters.find(monster => monster.hp > 0) !== undefined
            && encounter.players.find(player => player.hp > 0) !== undefined
        ) {
            if (turn % 2) {
                // monsters turn
                if(monsterMethod === 0) {
                    encounter = this.createEncounterOrder(monsterMethod, encounter, false)
                }
                encounter.players = this.attackEnemies(encounter.monsters, encounter.players);
            } else {
                // players turn
                if(playerMethod === 0) {
                    encounter = this.createEncounterOrder(playerMethod, encounter, true)
                }
                encounter.monsters = this.attackEnemies(encounter.players, encounter.monsters);
            }
            turn++
        }
        encounter.turns = Math.ceil(turn / 2.0)
        return encounter
    }


    simulateOutcome = () => {
        let outcomes = []
        for (let i = 0; i < this.props.encounter.attempts; i++) {
            let outcome = this.runEncounter(
                            parseInt(this.props.encounter.monsterMethod),
                            parseInt(this.props.encounter.playerMethod),
                            this.props.encounter.cancel
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
                        let rounds = 0;
                        this.state.outcomes.forEach(outcome => {
                            if (outcome.playersDowned === i) { rounds++; }
                        })
                        let percentage = (parseFloat(rounds / this.state.outcomes.length) * 100).toFixed(1)
                        return <div>{i} players die in {rounds} rounds ({percentage}%)</div>
                    })
                    : <div></div>
                }
            </div>
        )
    }
}