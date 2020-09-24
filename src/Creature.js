import React from 'react'
import './Creature.css'
import ContentEditable from 'react-contenteditable'
import { Tooltip } from '@material-ui/core'

export default class Creature extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateStats = this.handleUpdateStats.bind(this);
        this.state = { valid: { name: true, hp: true, ac: true, bonus: true, damage: true, initiative: true } }
    }

    // return true if dice are valid
    // this is not working properly
    validateDice(dice) {
        let retVal = true
        dice.split(' ').forEach(damageDie => {
            let dice = damageDie.split(/[+d]+/);
            if (
                isNaN(dice[0])
                || (dice.length > 1 && isNaN(dice[1]))
                || (dice.length > 2 && isNaN(dice[2]))
            ) {
                retVal = false
            }
        })
        return retVal
    }

    // return true for valid stats and false for invalid stats
    validateStats(name, hp, ac, bonus, damage, initiative) {
        return {
            name: name === false ? this.state.valid.name : typeof name === "string",
            hp: hp === false ? this.state.valid.hp : hp === "" || ((!isNaN(hp) && parseInt(hp) > 0)),
            ac: ac === false ? this.state.valid.ac : !isNaN(ac),
            bonus: bonus === false ? this.state.valid.bonus : !isNaN(bonus),
            damage: damage === false ? this.state.valid.damage : this.validateDice(damage),
            initiative: initiative === false ? this.state.valid.initiative : !isNaN(initiative)
        }
    }

    // castToInt(input) {
    //     if (input === "") {
    //         return input
    //     } else {
    //         return parseInt(input)
    //     }
    // }

    handleUpdateStats = (newName, newHp, newAc, newBonus, newDamage, newInitiative) => {
        this.setState({ valid: this.validateStats(newName, newHp, newAc, newBonus, newDamage, newInitiative) })
        let newCreature = {
            name: newName !== false ? newName : this.props.stats.name,
            hp: newHp !== false ? newHp : this.props.stats.hp,
            ac: newAc !== false ? newAc : this.props.stats.ac,
            bonus: newBonus !== false ? newBonus : this.props.stats.bonus,
            damage: newDamage !== false ? newDamage : this.props.stats.damage,
            initiative: newInitiative !== false ? newInitiative : this.props.stats.initiative
        }
        this.props.onUpdateStats(newCreature, this.props.number, this.props.isPlayer)
    }

    handleRemoveCreature = () => {
        this.props.onRemoveCreature(this.props.number, this.props.isPlayer)
    }

    handleCopyCreature = () => {
        this.props.onCopyCreature(this.props.number, this.props.isPlayer)
    }

    render() {
        return (
            <div className="margin">

                <div className="spread-right-left">
                    <ContentEditable
                        className={this.state.valid.name ? "name " : "error name"}
                        html={this.props.stats.name}
                        disabled={false}
                        onChange={event => this.handleUpdateStats(event.target.value, false, false, false, false, false)}
                    />
                    <div className="spread-right-left">
                        <button className="center-vertical" onClick={this.handleRemoveCreature}>delete</button>
                        <div>&nbsp;</div>
                        <button className="center-vertical" onClick={this.handleCopyCreature}>duplicate</button>
                    </div>
                </div>
                <div className="spread-right-left">
                    <div>HP:&nbsp; </div>
                    <Tooltip title={this.state.valid.hp ? "" : "HP must be a positive number"}>
                        <input
                            className={this.state.valid.hp ? "" : "error"}
                            type="text"
                            placeholder={"ex: 18"}
                            value={this.props.stats.hp}
                            onChange={event => this.handleUpdateStats(false, event.target.value, false, false, false, false)}
                        ></input>                        
                    </Tooltip>

                </div>
                <div className="spread-right-left">
                    <div>AC:&nbsp; </div>
                    <Tooltip title={this.state.valid.ac ? "" : "AC must be a number"}>
                        <input
                            className={this.state.valid.ac ? "" : "error"}
                            type="text"
                            placeholder={"ex: 16"}
                            value={this.props.stats.ac}
                            onChange={event => this.handleUpdateStats(false, false, event.target.value, false, false, false)}
                        ></input>
                    </Tooltip>

                </div>
                <div className="spread-right-left">
                    <div>Attack Bonus:&nbsp; </div>
                    <Tooltip title={this.state.valid.bonus ? "" : "Attack Bonus must be a number"} >
                        <input
                            className={this.state.valid.bonus ? "" : "error"}
                            type="text"
                            placeholder={"ex: 5"}
                            value={this.props.stats.bonus}
                            onChange={event => this.handleUpdateStats(false, false, false, event.target.value, false, false)}
                        ></input>
                    </Tooltip>
                    
                </div>
                <div className="spread-right-left">
                    <div>Damage Dice:&nbsp; </div>
                    <Tooltip title={this.state.valid.damage ? "" : "Damage Dice must be entered as (dice)d(sides)+(bonus)"} >
                        <input
                            className={this.state.valid.damage ? "" : "error"}
                            type="text"
                            placeholder={"ex: 1d8+3 3d6"}
                            value={this.props.stats.damage}
                            onChange={event => this.handleUpdateStats(false, false, false, false, event.target.value, false)}
                        ></input>
                    </Tooltip>
                </div>
                <div className="spread-right-left">
                    <div>Initiative Bonus:&nbsp; </div>
                    <Tooltip title={this.state.valid.initiative ? "" : "Initiative Bonus must be a number"}>
                        <input
                            className={this.state.valid.initiative ? "" : "error"}
                            type="text"
                            placeholder={"ex: 2"}
                            value={this.props.stats.initiative}
                            onChange={event => this.handleUpdateStats(false, false, false, false, false, event.target.value)}
                        ></input>                        
                    </Tooltip>

                </div>
            </div>
        )
    }
}