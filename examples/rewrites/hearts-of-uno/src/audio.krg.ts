import { AudioBank } from "krieg-lang/hoi4";
export const sound = AudioBank("krieg_uno", {
  path: "sound/krieg_uno.asset",
  volume: 0.5,
  maxAudible: 1,
  clips: {
    ku_draw: "UNO/draw_card.wav",
    ku_place: "UNO/card_dealt.wav",
    ku_reverse: "UNO/reverse.wav",
    ku_skip: "UNO/skip.wav",
    ku_plus_two: "UNO/draw2.wav",
    ku_plus_four: "UNO/draw4.wav",
    ku_uno: "UNO/uno.wav",
    ku_red: "UNO/red.wav",
    ku_blue: "UNO/blue.wav",
    ku_yellow: "UNO/yellow.wav",
    ku_green: "UNO/green.wav",
    ku_shuffle: "UNO/card_shuffle.wav",
  },
  compressor: {
    enabled: true,
    pregain: 3,
    postgain: 0,
    ratio: 10,
    threshold: -15,
    attacktime: 0.03,
    releasetime: 1.2,
  },
});
