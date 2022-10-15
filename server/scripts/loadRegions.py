import json
import requests

url = 'http://apis.data.go.kr/B090026/AirqualityService/getIvstg'

result = []

with open('codes.json') as f:
    codes = json.load(f)

for (code, region) in codes:
    response = requests.get(url, params={
        'mgtNo': code,
        'instgSpotNm': region,
        'type': 'json'
    })

    data = json.loads(response.content)

    if 'body' not in data['response']:
        print(data['response'])
        continue

    for i in data['response']['body']['ivstgGbs']:
        for j in i['ivstgs']:
            if 'xcnts' not in j or 'ydnts' not in j:
                continue
            result.append(j)

with open('../regions.json', 'w') as f:
    json.dump(result, f)
