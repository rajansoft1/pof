import json
import requests

dataDic = {}
arr = [



for data in reader:
    priceVersion = []
    a = {"price": data[2], "version": "0802-Bengaluru"}
    priceVersion.append(a)
    print priceVersion
    payload = {"name": data[0], "priceVersion": priceVersion, "code": data[1]}
    payload1 = json.dumps(payload)
    print payload1

    print payload
    r = requests.post(url, json=payload)
