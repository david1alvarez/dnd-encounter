import React from 'react'

export default class Creature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {creature: {}}
        this.handleUpdateStats = this.handleUpdateStats.bind(this);
    }

    handleUpdateStats = (newHp, newAc, newBonus, newDamage) => {
        this.props.isUpdating(true);
        let newCreature = {
            hp: newHp ? parseInt(newHp) : this.state.creature.hp,
            ac: newAc ? parseInt(newAc) : this.state.creature.ac,
            bonus: newBonus ? parseInt(newBonus) : this.state.creature.bonus,
            damage: newDamage ? newDamage : this.state.creature.damage
        }
        this.setState({creature: newCreature}, () => {this.props.isUpdating(false);})
        this.props.onUpdateStats(newCreature, this.props.number, this.props.isPlayer)
    }

    render() {
        return (
            <div>
                <h4>{this.props.isPlayer ? 'Player' : 'Monster'} {this.props.number + 1}</h4>
                <div>
                    HP:&nbsp; 
                    <input 
                        type="number" 
                        placeholder={18}
                        onChange={event => this.handleUpdateStats(event.target.value, false, false, false)}
                    ></input>
                </div>
                <div>
                    AC:&nbsp; 
                    <input 
                        type="number" 
                        placeholder={16}
                        onChange={event => this.handleUpdateStats(false, event.target.value, false, false)}
                    ></input>
                </div>
                <div>
                    Attack Bonus:&nbsp; 
                    <input 
                        type="number" 
                        placeholder={3}
                        onChange={event => this.handleUpdateStats(false, false, event.target.value, false)}
                    ></input>
                </div>
                <div>
                    Damage per hit:&nbsp; 
                    <input 
                        type="text" 
                        placeholder={"1d8 3d6"}
                        onChange={event => this.handleUpdateStats(false, false, false, event.target.value)}
                    ></input>
                </div>
            </div>
        )
    }
}