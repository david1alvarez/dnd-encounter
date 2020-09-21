import React from 'react'
import './Creature.css'

export default class Creature extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateStats = this.handleUpdateStats.bind(this);
    }

    castToInt(input) {
        if (input === "") {
            return input
        } else {
            return parseInt(input)
        }
    }

    handleUpdateStats = (newHp, newAc, newBonus, newDamage, newInitiative) => {
        let newCreature = {
            hp: newHp !== false ? this.castToInt(newHp) : this.props.stats.hp,
            ac: newAc !== false ? this.castToInt(newAc) : this.props.stats.ac,
            bonus: newBonus !== false ? this.castToInt(newBonus) : this.props.stats.bonus,
            damage: newDamage !== false ? newDamage : this.props.stats.damage,
            initiative: newInitiative !== false ? this.castToInt(newInitiative) : this.props.stats.initiative
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
                    <h4>{this.props.isPlayer ? 'Player' : 'Monster'} {this.props.number + 1}</h4>
                    <button onClick={this.handleRemoveCreature}>delete</button>
                    <button onClick={this.handleCopyCreature}>duplicate</button>
                </div>
                <div className="spread-right-left">
                    <div>HP:&nbsp; </div>
                    <input 
                        type="text"
                        placeholder={"ex: 18"}
                        value={(typeof this.props.stats?.hp === "number") ? this.props.stats?.hp : ''}
                        onChange={event => this.handleUpdateStats(event.target.value, false, false, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>AC:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"ex: 16"}
                        value={(typeof this.props.stats?.ac === "number") ? this.props.stats?.ac : ''}
                        onChange={event => this.handleUpdateStats(false, event.target.value, false, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Attack Bonus:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"ex: 5"}
                        value={(typeof this.props.stats?.bonus === "number") ? this.props.stats?.bonus : ''}
                        onChange={event => this.handleUpdateStats(false, false, event.target.value, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Damage per hit:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"ex: 1d8+3 3d6"}
                        value={(typeof this.props.stats?.damage === "string") ? this.props.stats?.damage : ''}
                        onChange={event => this.handleUpdateStats(false, false, false, event.target.value, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Initiative bonus:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"ex: 2"}
                        value={(typeof this.props.stats?.initiative === "number") ? this.props.stats?.initiative : ''}
                        onChange={event => this.handleUpdateStats(false, false, false, false, event.target.value)}
                    ></input>
                </div>
            </div>
        )
    }
}