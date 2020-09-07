import React from 'react'
import './Creature.css'

export default class Creature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {creature: {}}
        this.handleUpdateStats = this.handleUpdateStats.bind(this);
    }

    handleUpdateStats = (newHp, newAc, newBonus, newDamage, newInitiative) => {
        let newCreature = {
            hp: newHp !== false ? newHp : this.state.creature.hp,
            ac: newAc !== false ? newAc : this.state.creature.ac,
            bonus: newBonus !== false ? newBonus : this.state.creature.bonus,
            damage: newDamage !== false ? newDamage : this.state.creature.damage,
            initiative: newInitiative !== false ? newInitiative : this.state.creature.initiative
        }
        this.setState({creature: newCreature})
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
                        type="number"
                        placeholder={18}
                        value={this.props.stats?.hp}
                        onChange={event => this.handleUpdateStats(event.target.value, false, false, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>AC:&nbsp; </div>
                    <input 
                        type="number" 
                        placeholder={16}
                        value={this.props.stats?.ac}
                        onChange={event => this.handleUpdateStats(false, event.target.value, false, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Attack Bonus:&nbsp; </div>
                    <input 
                        type="number" 
                        placeholder={5}
                        value={this.props.stats?.bonus}
                        onChange={event => this.handleUpdateStats(false, false, event.target.value, false, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Damage per hit:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"1d8+3 3d6"}
                        value={this.props.stats?.damage}
                        onChange={event => this.handleUpdateStats(false, false, false, event.target.value, false)}
                    ></input>
                </div>
                <div className="spread-right-left">
                    <div>Initiative bonus:&nbsp; </div>
                    <input 
                        type="text" 
                        placeholder={"2"}
                        value={this.props.stats?.initiative}
                        onChange={event => this.handleUpdateStats(false, false, false, false, event.target.value)}
                    ></input>
                </div>
            </div>
        )
    }
}