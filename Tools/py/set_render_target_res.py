import unreal
import re
import sys

# Run this script from the Unreal editor's command prompt like this:
#
# py C:\path\to\mod\folder\Tools\py\set_render_target_res.py 256
#
# Note that the number at the end of that command controls the resolution

skin_assets = unreal.EditorAssetLibrary.list_assets('/Game/Actors/Characters/Player/', True, False)

# Paths look like this:
# /Game/Actors/Characters/Player/Master/Skins/Nuru/T_Nuru_S.T_Nuru_S

for rt_path in [x for x in skin_assets if re.search(r'\.T_.+', x)]:
  print(rt_path)
  render_target = unreal.EditorAssetLibrary.load_asset(rt_path)
  render_target.set_editor_property('size_x', int(sys.argv[1]))
  render_target.set_editor_property('size_y', int(sys.argv[1]))
