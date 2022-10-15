from pyproj import Transformer

transformer = Transformer.from_crs('epsg:5179', 'epsg:4326')

print(transformer.transform(1121213.248, 1716111.353))
