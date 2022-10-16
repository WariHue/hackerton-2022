import json
import requests

url = 'http://apis.data.go.kr/B090026/AirqualityService/getIvstg'

result = []

with open('codes.json') as f:
    codes = json.load(f)

adresses: set[str] = set()

current = 0

count = len(codes)

for (code, region) in codes:
    current += 1
    print(f"{(code,region)} {current} / {count}")

    response = requests.get(url, params={
        'mgtNo': code,
        'instgSpotNm': region,
        'type': 'json',
        'ServiceKey': 'iAmKwcLT/hXPG/RQu4QDFJ/Uk3GtIUeDJI72ICctXXmTJeT0e0Yj136ziqX3lC71m0Q/RAUaELUeMv2+tve3vg=='
    })

    try:
        data = json.loads(response.content)
    except Exception as e:
        print(response.content)
        raise e

    if 'body' not in data['response']:
        print(data['response'])
        continue

    for i in data['response']['body']['ivstgGbs']:
        for j in i['ivstgs']:
            if  'adres' not in j or 'xcnts' not in j or 'ydnts' not in j:
                continue
            print(j['adres'])
            if j['adres'] in adresses:
                continue
            adresses.add(j['adres'])
            result.append(j)

with open('../regions.json', 'w') as f:
    json.dump(result, f)
