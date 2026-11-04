import { ScriptedWindow, GuiVariable, type GuiBindings } from "krieg-lang/ui";
import { type CountryScope } from "krieg-lang/hoi4";
import { technologies } from "./technologies.krg.ts";
import { treeLayout } from "./tree-layout.krg.ts";
import { treeClick } from "./core.krg.ts";
import { priorityClick } from "./planner.krg.ts";

interface Cell {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  mio: boolean;
  hiddenGate: boolean;
}
function TechnologyCell(ui: GuiBindings<CountryScope>, folder: number, cell: Cell) {
  const tech = technologies[cell.index - 1];
  const name = "rq_tr" + folder + "_" + cell.index;
  const tiny = cell.width === 39;
  const badgeX = cell.x + (tiny ? 39 : cell.width - 27);
  const badgeY = cell.y + (tiny ? 5 : cell.height - 27);
  return [
    <ui.Container
      name={name + "_hitbox"}
      position={{ x: cell.x, y: cell.y }}
      size={{ width: cell.width, height: cell.height }}
      clipping={false}
    >
      <ui.Button
        name={name + "_hit"}
        position={{ x: 0, y: 0 }}
        spriteType={"GFX_rq_hit_" + cell.width + "x" + cell.height}
        tooltip={"RQ_TRH_" + cell.index}
        clickSound="click_default"
        visible={(c) =>
          c.triggers.has_country_flag("rq_qmode") &&
          !c.triggers.has_tech(tech.id) &&
          (!cell.hiddenGate || !c.arrayContains("global.rq_hid", cell.index))
        }
        click={(c) => {
          c.addVariable("rq_dirty", 1);
          c.setTempVariable("rq_t", cell.index);
          c.setTempVariable("rq_top", 0);
          c.setTempVariable("rq_mopen", 0);
          c.run(treeClick);
        }}
        events={{
          shiftClick: (c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_t", cell.index);
            c.setTempVariable("rq_top", 0);
            c.setTempVariable("rq_mopen", 1);
            c.run(treeClick);
          },
          controlClick: (c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_t", cell.index);
            c.setTempVariable("rq_top", 1);
            c.setTempVariable("rq_mopen", 0);
            c.run(treeClick);
          },
          rightClick: (c) => {
            c.addVariable("rq_dirty", 1);
            c.setTempVariable("rq_t", cell.index);
            c.run(priorityClick);
          },
        }}
      />
    </ui.Container>,
    cell.mio && (
      <ui.Icon
        name={name + "_mio"}
        position={{
          x: cell.x + (cell.width === 338 ? (folder === 11 ? -1 : 9) : -3),
          y: cell.y + cell.height - 31,
        }}
        spriteType="GFX_design_team_icon"
        scale={0.6}
        alwaysTransparent
        properties={{ image: "[rq_trm_" + cell.index + "]" }}
        visible={(c) =>
          c.triggers.has_country_flag("rq_qmode") && c.variable("rq_ms_" + tech.id) > 0
        }
      />
    ),
    [1, 2, 3].map((layer) => (
      <ui.Icon
        name={name + (layer === 1 ? "_badge" : "_badge" + layer)}
        position={{ x: badgeX, y: badgeY }}
        spriteType={layer === 1 ? "GFX_rq_badge" : "GFX_rq_badge" + layer}
        alwaysTransparent
        properties={{ frame: GuiVariable("rq_pf_" + tech.id) }}
        visible={(c) =>
          c.triggers.has_country_flag("rq_qmode") &&
          (layer === 1
            ? c.variable("rq_p_" + tech.id) > 0 && c.variable("rq_p_" + tech.id) < 100
            : layer === 2
              ? c.variable("rq_p_" + tech.id) > 99 && c.variable("rq_p_" + tech.id) < 550
              : c.variable("rq_p_" + tech.id) > 549)
        }
      />
    )),
    <ui.Icon
      name={name + "_pri"}
      position={{ x: cell.x + (tiny ? 30 : cell.width - 23), y: cell.y + (tiny ? -6 : 1) }}
      spriteType="GFX_rq_pri"
      alwaysTransparent
      visible={(c) =>
        c.triggers.has_country_flag("rq_qmode") &&
        c.triggers.has_country_flag("rq_ap_on") &&
        c.arrayContains("rq_ap_pri", cell.index)
      }
    />,
  ];
}
export const trees = treeLayout.map((folder) => {
  const layout = (ui: GuiBindings<CountryScope>) => (
    <ui.Container
      name={"rq_tree_" + folder.folder}
      position={{ x: folder.offset === "0" ? 0 : folder.offset, y: 0 }}
      size={{ width: 10, height: 10 }}
      orientation={folder.centered ? "CENTER_UP" : "UPPER_LEFT"}
      clipping={false}
    >
      {folder.cells.map((cell) => TechnologyCell(ui, folder.number, cell))}
    </ui.Container>
  );
  if (folder.parentToken !== "")
    return ScriptedWindow(
      {
        name: "rq_tree_" + folder.folder + "_gui",
        path: "interface/rq_tree.gui",
        context: "player_context",
        parentWindowToken: folder.parentToken,
        visible: (c) => c.triggers.has_country_flag("rq_active"),
      },
      layout,
    );
  return ScriptedWindow(
    {
      name: "rq_tree_" + folder.folder + "_gui",
      path: "interface/rq_tree.gui",
      context: "player_context",
      parentWindowName: folder.parentName,
      visible: (c) => c.triggers.has_country_flag("rq_active"),
    },
    layout,
  );
});
