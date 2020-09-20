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
    if "actions" in monster:
        newType["actions"] = convertActions(monster["actions"])
    return newType

monsterList = list(map(convertType, monsterList))

print(json.dumps(monsterList))

f = open('monsters.json', 'w')
f.write(json.dumps(monsterList))
f.close()

# with open('monsters.json', 'w') as outfile:
#     print(list(monsterList))
#     json.dump({"monsters": list(monsterList)}, outfile)





# import requests
# import json

# response = requests.get("https://www.dnd5eapi.co/api/monsters")

# vals = response.json()
# # url_list = map(lambda result: result.url, response.json().results)
# urls = map(lambda monster: monster["url"], vals["results"])
# urls = list(urls)

# # monsters = []
# counter = 0
# f = open("monsters.txt", "a")
# for url in urls:
#     counter += 1
#     print(url+f' {counter * 100 // len(urls)}')
#     response = requests.get("https://www.dnd5eapi.co"+url)
#     values = response.json()
#     # monsters.append(json)
#     f.write(json.dumps(values))
# f.close()

# print(monsters)