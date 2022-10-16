import csv
import json

with open('data.csv', encoding='UTF-8') as f:
    lines = csv.reader(f.readlines())

result: list[dict] = []

first = True

for line in lines:
    try:
        if first:
            first = False
            continue
        if '경상남도' not in line[3]:
            continue

        for i in result:
            if i[0] == line[0] and i[1] == line[2]:
                raise StopIteration()

        if len(line[2].split('-')) == 1:
            continue

        result.append((line[0], line[2]))
    except StopIteration:
        continue

with open('codes.json', 'w') as f:
    json.dump(result, f)
