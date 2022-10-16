import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('regions.json') as f:
    regions = json.load(f)


"""
sort
0 - 이산화질소
1 - 미세먼지
2 - 일산화탄소
3 - 아황산가스
"""


@app.get('/search')
def search(q: str = '', skip: int = 0, limit: int = 30, sort: int = 0):
    hits = []

    for reg in regions:
        if 'adres' not in reg:
            continue
        if q in reg['adres']:
            odr = reg['odrs'][-1]

            if 'pm10Val' not in odr or 'no2Val' not in odr or 'so2Val' not in odr or 'coVal' not in odr:
                continue

            val = {
                'address': reg['adres'],
                'sd': float(odr['pm10Val']),
                'isj': float(odr['no2Val']),
                'ag': float(odr['so2Val']),
                'iot': float(odr['coVal'])
            }

            hits.append(val)

    if sort == 0:
        hits = list(sorted(hits, key=lambda x: x['isj'], reverse=True))

    # if sort == 1
    # sorted(hits)
    return {
        'count': len(hits),
        'results': hits[skip:skip+limit]


    }

app.mount('/', StaticFiles(directory='../client/dist/', html=True), name='static')
