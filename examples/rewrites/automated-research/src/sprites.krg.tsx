import { SpriteFile, Sprite, AnimatedSprite } from "krieg-lang/ui";
import { interfaceSprites } from "./sprite-catalogue.krg.ts";
import { countryFlags } from "./save-facts.krg.ts";

export const sprites = SpriteFile("interface/rq_assets.gfx", [
  ...interfaceSprites.map((image) => Sprite(image)),
  ...countryFlags
    .filter((flag) => !flag.governments.some((government) => government.code === flag.code))
    .map((flag) =>
      Sprite({ name: "GFX_rq_flag_" + flag.code, textureFile: "gfx/flags/" + flag.tag + ".tga" }),
    ),
  ...countryFlags.flatMap((flag) =>
    flag.governments.map((government) =>
      Sprite({
        name: "GFX_rq_flag_" + government.code,
        textureFile: "gfx/flags/" + flag.tag + "_" + government.name + ".tga",
      }),
    ),
  ),
  AnimatedSprite({
    name: "GFX_rq_qbar_anim",
    textureFile: "gfx/interface/rq_qbar_anim.dds",
    noOfFrames: 12,
    animationRateFps: 24,
    looping: true,
    playOnShow: true,
    pauseOnLoop: 0,
    alwaysTransparent: true,
    transparenceCheck: true,
  }),
  ...["sd", "ld"].flatMap((kind) => [
    AnimatedSprite({
      name: "GFX_rq_" + kind + "_cvok",
      textureFile: "gfx/interface/rq_" + kind + "_cvok.dds",
      noOfFrames: 8,
      animationRateFps: 2,
      looping: false,
      playOnShow: true,
      pauseOnLoop: 0,
      alwaysTransparent: true,
    }),
    AnimatedSprite({
      name: "GFX_rq_" + kind + "_cvno",
      textureFile: "gfx/interface/rq_" + kind + "_cvno.dds",
      noOfFrames: 9,
      animationRateFps: 1,
      looping: false,
      playOnShow: true,
      pauseOnLoop: 0,
      alwaysTransparent: true,
    }),
  ]),
]);
