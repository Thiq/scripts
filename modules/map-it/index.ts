import * as map from 'map-it';
import * as Material from '@org.bukkit.Material';
import * as ItemStack from '@org.bukkit.inventory.ItemStack';
import { MapView, MapCanvas, MapRenderer } from '@org.bukkit.map.MapView';

function getMapForPlayer(player) {
  let map = new ItemStack(Material.MAP);
  let meta = map.getItemMeta();
  let renderer = new MapRenderer(true);

}

export function giveMap(player) {
  let map = getMapForPlayer(player);
  player.giveMap(map);
}
