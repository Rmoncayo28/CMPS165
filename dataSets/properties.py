import json, csv, tempfile
from pprint import pprint
with open('education_dataset.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    dictionary = dict()
    for row in reader:
        dictionary[row['GEO.id']] = [row['GEO.id2'], row['HC01_EST_VC21'], row['HC01_EST_VC22'], row['HC01_EST_VC23']]
        #print(row['GEO.id'], row['GEO.id2'], row['HC01_EST_VC21'], row['HC01_EST_VC22'], row['HC01_EST_VC23'])
        #print(dictionary[row['GEO.id']], dictionary[row['GEO.id']][0], dictionary[row['GEO.id']][1])
with open('caTractsAndCounties.json') as data_file:
    data = json.load(data_file)
    arcs = data['objects']['tracts']['geometries']
    for arc in arcs:
        #print(type(arc))
        #print(arc['properties']['AFFGEOID']), print(dictionary[arc['properties']['AFFGEOID']])
        arc['properties']['totPop18p'] = dictionary[arc['properties']['AFFGEOID']][1]
        arc['properties']['inColCent'] = dictionary[arc['properties']['AFFGEOID']][2]
        arc['properties']['numInCol'] = dictionary[arc['properties']['AFFGEOID']][3]
print(data)

#print(data)
#print(dictionary)
#When running this command, the output must be redirected to a non-existent file.