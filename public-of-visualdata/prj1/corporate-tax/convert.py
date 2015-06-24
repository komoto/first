import json

world = open('topo_world_countries_with_meta.topojson').read()

world_json_data = json.loads(world)

world_json_data["objects"]["countries"]["geometries"].append(world_json_data["objects"]["countries"]["geometries"][0])
world_json_data["objects"]["countries"]["geometries"].append(world_json_data["objects"]["countries"]["geometries"][1])

new_json =  open('topo_world_countries_st.topojson',"w")
new_json.write(json.dumps(world_json_data))
new_json.close()
