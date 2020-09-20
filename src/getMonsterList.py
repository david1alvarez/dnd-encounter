import json

with open('./monsterData.json') as f:
    data = json.load(f)
    f.close()
monsterList = data["monsters"]




def convertDamage(damages):
    newList = []
    for damage in damages:
        if "damage_dice" in damage:
            newList.append({"damage_dice": damage["damage_dice"]})
        else:
            newList.append(damage)
    return newList

def convertActions(actions):
    newList = []
    for action in actions:
        newItem = {
            "name": action["name"],
            "desc": action["desc"]
        }
        if "usage" in action:
            newItem["usage"] = action["usage"]
        if "attack_bonus" in action:
            newItem["attack_bonus"] = action["attack_bonus"]
        if "damage" in action:
            newItem["damage"] = convertDamage(action["damage"])
        if "options" in action:
            newItem["options"] = action["options"]
        newList.append(newItem)
    return newList

def convertType(monster):
    newType = {}
    newType["name"] = monster["name"]
    newType["armor_class"] = monster["armor_class"]
    newType["hit_points"] = monster["hit_points"]
    if "actions" in monster:
        newType["actions"] = convertActions(monster["actions"])
    return newType

monsterList = list(map(convertType, monsterList))

print(json.dumps(monsterList))

f = open('monsters.json', 'w')
f.write(json.dumps({
        "comments": "if a creature has the Multiattack action, they then use that. Otherwise, they'll use whichever attack has the highest possible damage",
        "monsters": monsterList
        })
)
f.close()